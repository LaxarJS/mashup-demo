/**
 * Copyright 2015 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   'angular',
   'laxar',
   'laxar-uikit',
   'jquery',
   'moment',
   'jquery-ui/ui/datepicker',
   'jquery-ui/ui/i18n/datepicker-de'
], function( ng, ax, ui, $, moment ) {
   'use strict';

   var directiveName = 'axDatePicker';
   var directive = [ '$q', '$window', function( $q, $window ) {

      var additionalCalendarClassesRules = {
         '.ui-datepicker': 'popover',
         'button, a.ui-corner-all': MISSING_BUTTON_CLASSES,
         '.ui-datepicker-close': 'btn-primary',
         '.ui-datepicker-month, .ui-datepicker-year, .ui-datepicker-month-year': 'form-control'
      };

      // The jquery ui date picker doesn't explicitly define an english (US) locale with en language tag, but
      // treats it as its default locale. For simpler region selection we the en key ourselves.
      $.datepicker.regional.en = $.datepicker.regional[ '' ];

      var DatePicker = $.datepicker.constructor;

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      // In jQuery-UI going to today only means changing the year and month to the current ones, but not
      // selecting today already. We thus extend the according method using some internal apis.
      var origGotoToday = DatePicker.prototype._gotoToday;
      DatePicker.prototype._gotoToday = function( id ) {
         // Change the year and month like the original implementation does
         origGotoToday.apply( this, arguments );

         var $picker = $( id );
         // Setting the date on the picker and the according input,
         $picker.datepicker( 'setDate', new Date() );

         // Propagate the change to listeners manually, especially to out ModelController as used below.
         this._get( this._getInst( $picker[0] ), 'onSelect' )( $picker.val() );
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      // Tapping the _updateDatepicker method to send an event when the calendar is rendered. We then can use
      // this event to add some css classes and other things.
      var origUpdateDatepicker = DatePicker.prototype._updateDatepicker;
      DatePicker.prototype._updateDatepicker = function( inst ) {
         origUpdateDatepicker.apply( this, arguments );
         inst.input.trigger( 'axDatePickerUpdated' );
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      return {
         restrict: 'A',
         require: [ 'ngModel', '?axInput' ],
         link: function( scope, textField, attrs, controllers ) {

            // Augment the textField DOM.
            var wrapper = $( '<div class="ax-date-picker input-group"></div>' ).insertBefore( textField );
            textField.detach().appendTo( wrapper ).addClass( 'form-control' );
            var button = $( '<button type="button" class="ui-datepicker-trigger btn btn-default">' );
            button.on( 'click', showDatePickerDialog );
            textField.on( 'focus', showDatePickerDialog );
            wrapper.append( button );

            var ngModel = controllers[0];
            var axInput = controllers[1] || null;
            var languageTag;
            var state = {
               disabled: false,
               readonly: false
            };

            watchInputState();
            updateLocale();

            //////////////////////////////////////////////////////////////////////////////////////////////////

            var options = ax.object.options( scope.$eval( attrs[ directiveName ] ), {
               buttonText: '',
               changeMonth: true,
               changeYear: true,
               constrainInput: false,
               showButtonPanel: true,
               showOn: 'focus',
               onClose: function( dateStr ) {
                  currentlyVisiblePicker = null;
                  scope.$apply( function() {
                     ngModel.$setViewValue( dateStr );
                  } );
               },
               beforeShow: function() {
                  currentlyVisiblePicker = textField;
               }
            } );

            if( options.yearRange && !options.minDate && !options.maxDate ) {
               ax.log.warn(
                  'axDatePicker: option yearRange requires minDate and maxDate! scope=[0], model=[1]',
                  scope.id(''),
                  attrs.ngModel
               );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            if( !axInput ) {
               // If there is an axInput, this will take care of formatting and parsing. Thus we only need to
               // handle it, if there is no axInput controller found on the scope.

               ngModel.$formatters.unshift( function( modelValue ) {
                  var momentFormat = ui.i18n.momentFormatForLanguageTag( languageTag );
                  if( typeof modelValue === 'string' ) {
                     var momentDate = moment( modelValue, ISO_DATE_FORMAT );
                     if( momentDate.isValid() ) {
                        return momentDate.format( momentFormat.date );
                     }
                  }
                  return '';
               } );

               ngModel.$parsers.push( function( viewValue ) {
                  var momentFormat = ui.i18n.momentFormatForLanguageTag( languageTag );
                  if( viewValue ) {
                     var momentDate = moment( viewValue, momentFormat.date );
                     if( momentDate.isValid() ) {
                        return momentDate.format( ISO_DATE_FORMAT );
                     }
                  }
                  return null;
               } );
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            var dialogCreated = false;
            var dialogBeingShown = false;

            function showDatePickerDialog() {

               if( dialogBeingShown ) {
                  return;
               }
               else if( dialogCreated && currentlyVisiblePicker === textField ) {
                  // MSIE10 will re-focus & re-open immediately otherwise...
                  $window.setTimeout( function() {
                     textField.datepicker( 'hide' );
                  }, 0 );
                  return;
               }
               dialogBeingShown = true;

               updateLocale().then( function( language ) {
                  if( !dialogCreated ) {
                     textField.off( 'focus', showDatePickerDialog );
                     createDatePickerDialog( language );
                     dialogCreated = true;
                     textField.datepicker( 'show' );
                  }
                  else {
                     textField.trigger( 'focus' );
                  }
                  dialogBeingShown = false;
               } );

               ///////////////////////////////////////////////////////////////////////////////////////////////

               function createDatePickerDialog( language ) {

                  textField.datepicker( ax.object.options( {
                     disabled: state.readonly || state.disabled
                  }, options ) );
                  updateDialogLanguage( language );

                  var calendar = textField.datepicker( 'widget' );
                  textField.on( 'axDatePickerUpdated', function() {
                     // When the calendar is drawn, we add some bootstrap css classes. We otherwise would need to
                     // extend in the scss files, which leads to twice the number of lines in the css file.
                     $.each( additionalCalendarClassesRules, function( selector, classes ) {
                        calendar.find( selector ).addClass( classes );
                        if( calendar.is( selector ) ) {
                           calendar.addClass( classes );
                        }
                     } );

                     calendar.find( 'a' ).on( 'click', function( event ) {
                        event.preventDefault();
                     } );
                  } );

               }

            }

            //////////////////////////////////////////////////////////////////////////////////////////////////
            // Localization
            //////////////////////////////////////////////////////////////////////////////////////////////////

            scope.$watch( 'i18n', function( newValue, oldValue ) {
               if( newValue === oldValue ) { return; }
               updateLocale();
            }, true );

            function updateLocale() {
               languageTag = ui.i18n.languageTagFromScope( scope );

               return loadLanguage( languageTag.split( '_' ) )
                  .then( function( loadedLanguage ) {
                     return dialogCreated ? updateDialogLanguage( loadedLanguage ) : loadedLanguage;
                  }, function() {
                     ax.log.error( 'Unsupported language tag "[0]". Falling back to "en".', languageTag );
                     return dialogCreated ? updateDialogLanguage( 'en' ) : 'en';
                  } );

            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function updateDialogLanguage( language ) {
               if( !language ) {
                  ax.log.warn( 'No specific language found. Thus using "en".' );
                  language = 'en';
               }

               textField.datepicker( 'option', $.datepicker.regional[ language ] );
               // jQuery date picker resets view value on initialization:
               if( ngModel.$modelValue ) {
                  textField.datepicker( 'setDate', moment( ngModel.$modelValue, ISO_DATE_FORMAT ).toDate() );
               }

               return language;
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function updateDialogState() {
               if( dialogCreated ) {
                  textField.datepicker( 'option', 'disabled', state.readonly || state.disabled );
               }
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            function watchInputState() {
               if( attrs.ngDisabled ) {
                  scope.$watch( attrs.ngDisabled, function( attributeValue ) {
                     state.disabled = !!attributeValue;
                     updateDialogState();
                     button.attr( 'disabled', state.disabled );
                  } );
               }
               if( attrs.ngReadonly ) {
                  scope.$watch( attrs.ngReadonly, function( attributeValue ) {
                     state.readonly = !!attributeValue;
                     updateDialogState();
                     button.attr( 'readonly', state.readonly );
                  } );
               }
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////

            scope.$on( '$destroy', function() {
               try {
                  textField.datepicker( 'destroy' );
                  textField.off( 'focus', showDatePickerDialog );
                  button.off( 'click' );
                  if( currentlyVisiblePicker === textField ) {
                     currentlyVisiblePicker = null;
                  }
               }
               catch( e ) {
                  // Ignore. DOM node has been destroyed before the directive.
               }

               ngModel.$formatters = [];
               ngModel.$parsers = [];
               ngModel = null;
               textField = null;
               wrapper = null;
            } );
         }

      };


      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      function loadLanguage( tagParts ) {

         var currentTag = tagParts.join( '-' );
         if( currentTag in $.datepicker.regional ) {
            return $q.when( currentTag );
         }

         if( tagParts.length > 1 && COUNTRY_SENSITIVE_TAGS.indexOf( currentTag ) === -1 ) {
            return loadLanguage( [ tagParts[ 0 ] ] );
         }

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         var deferred = $q.defer();
         require( [ 'jquery_ui/i18n/datepicker-' + currentTag ], function() {
            if( !( currentTag in $.datepicker.regional ) ) {
               // Fix for IE: Although IE could not load the file, it claims to have done so. We know that IE
               // is a liar, if the language tag is not present in the region map
               // (https://github.com/LaxarJS/laxar-uikit/issues/46)
               return languageNotFound();
            }

            deferred.resolve( currentTag );
         }, languageNotFound );

         function languageNotFound() {
            if( tagParts.length > 1 ) {
               tagParts.pop();
               deferred.resolve( loadLanguage( tagParts ) );
               return;
            }
            deferred.reject();
         }

         return deferred.promise;
      }

   } ];

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   // Based on what jQuery UI supports, if our country code is not in this list, localize by tag only:
   var COUNTRY_SENSITIVE_TAGS = [
      'ar-DZ', 'cy-GB', 'en-AU', 'en-GB', 'en-NZ', 'fr-CA', 'fr-CH', 'it-CH', 'nl-BE', 'pt-BR',
      'zh-CN', 'zh-HK', 'zh-TW'
   ];

   var MISSING_BUTTON_CLASSES = 'btn btn-default';
   var ISO_DATE_FORMAT = 'YYYY-MM-DD';

   // shared global state: identifies the currently visible date picker by its input field
   var currentlyVisiblePicker = null;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   return ng.module( directiveName + 'Control', [] ).directive( directiveName, directive );

} );
