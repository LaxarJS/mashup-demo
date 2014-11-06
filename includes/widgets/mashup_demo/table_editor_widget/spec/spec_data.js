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
   'expectedTableModel': [
      [null, 'Company A', 'Company B', 'Company C'],
      ['2011-02-01', 1, 1.0000001, 1000000.1],
      ['2012-03-02', 2, 2.0000002, 1000000.2],
      ['2013-04-03', 3, 3.0000003, 1000000.3],
      ['2014-05-04', 4, 4.0000004, 1000000.4]
   ],
   'expectedResourceWithRemovedTimeGridTick': {
      'timeLabel': 'Time',
      'valueLabel': 'Stock Value',
      'timeGrid': ['2011-02-01', '2013-04-03', '2014-05-04'],
      'series': [
         {
            'label': 'Company A',
            'values': [
               1, 3, 4
            ]
         },
         {
            'label': 'Company B',
            'values': [
               1.0000001, 3.0000003, 4.0000004
            ]
         },
         {
            'label': 'Company C',
            'values': [
               1000000.1, 1000000.3, 1000000.4
            ]
         }
      ]
   },
   'expectedResourceWithRemovedSeriesLabel': {
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
            'label': 'Company C',
            'values': [
               1000000.1, 1000000.2, 1000000.3, 1000000.4
            ]
         }
      ]
   },
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
   'expectedTableModelForOtherResource': [
      [ null, 'Company A', 'Company B' ],
      [ '1990-01-01', 1, 2 ],
      [ '1991-01-01', 2, 3 ],
      [ '1992-01-01', 3, 2 ]
   ]
} );
