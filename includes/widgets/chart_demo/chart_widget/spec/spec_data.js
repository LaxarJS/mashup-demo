define( {
   'originalResource': {
      'timeLabel': 'Time',
      'valueLabel': 'Stock Value',
      'timeGrid': ['2011-02-01', '2012-03-02', '2013-04-03', '2014-05-04'],
      'series': [
         {
            'label': 'Company A',
            'values': [
               1, 2, 3, 4
            ]
         },
         {
            'label': 'Company B',
            'values': [
               1.0000001, 2.0000002, 3.0000003, 4.0000004
            ]
         },
         {
            'label': 'Company C',
            'values': [
               1000000.1, 1000000.2, 1000000.3, 1000000.4
            ]
         }
      ]
   },
   'expectedChartModel': [
      {
         'values': [
            {
               'x': 1296514800000,
               'y': 1
            },
            {
               'x': 1330642800000,
               'y': 2
            },
            {
               'x': 1364940000000,
               'y': 3
            },
            {
               'x': 1399154400000,
               'y': 4
            }
         ],
         'key': 'Company A'
      },
      {
         'values': [
            {
               'x': 1296514800000,
               'y': 1.0000001
            },
            {
               'x': 1330642800000,
               'y': 2.0000002
            },
            {
               'x': 1364940000000,
               'y': 3.0000003
            },
            {
               'x': 1399154400000,
               'y': 4.0000004
            }
         ],
         'key': 'Company B'
      },
      {
         'values': [
            {
               'x': 1296514800000,
               'y': 1000000.1
            },
            {
               'x': 1330642800000,
               'y': 1000000.2
            },
            {
               'x': 1364940000000,
               'y': 1000000.3
            },
            {
               'x': 1399154400000,
               'y': 1000000.4
            }
         ],
         'key': 'Company C'
      }
   ],
   'otherResource': {
      'timeLabel': 'The Nineties',
      'valueLabel': 'Stock Exchange Value',
      'timeGrid': [ '1990-01-01', '1991-01-01', '1992-01-01' ],
      'series': [
         {
            'label': 'Company A',
            'values': [
               1, 2, 3
            ]
         },
         {
            'label': 'Company B',
            'values': [
               2, 3, 2
            ]
         }
      ]
   },
   'expectedChartModelForOtherResource': [
      {
         'values': [
            {
               'x': 631148400000,
               'y': 1
            },
            {
               'x': 662684400000,
               'y': 2
            },
            {
               'x': 694220400000,
               'y': 3
            }
         ],
         'key': 'Company A'
      },
      {
         'values': [
            {
               'x': 631148400000,
               'y': 2
            },
            {
               'x': 662684400000,
               'y': 3
            },
            {
               'x': 694220400000,
               'y': 2
            }
         ],
         'key': 'Company B'
      }
   ],
   'patchesWithNewValuesOnly': [
      {
         'op': 'replace',
         'path': '/series/0/values/0',
         'value': 32
      },
      {
         'op': 'replace',
         'path': '/series/1/values/2',
         'value': 22
      }
   ],
   'patchesWithNewValuesAndLabel': [
      {
         'op': 'replace',
         'path': '/series/0/values/0',
         'value': 32
      },
      {
         'op': 'replace',
         'path': '/series/1/label',
         'value': 'New Company'
      },
      {
         'op': 'replace',
         'path': '/series/1/values/2',
         'value': 22
      }
   ]
} );
