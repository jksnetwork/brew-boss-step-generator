var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');


$('.table-add').click(function () {
    var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
    $TABLE.find('table').append($clone);
});

$(document).on('click', '.table-remove', function(e) {
	$(this).parents('tr').detach();
});

jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;


$(document).ready(function () {
	
	$('#files').bind('change', importFromSTP);

    function exportTableToSTP($table, filename) {

        var $rows = $table.find('tr:not(:hidden):not(:has(th))'),

            // Temporary delimiter characters unlikely to be typed by keyboard
            // This is to avoid accidentally splitting the actual contents
            tmpColDelim = String.fromCharCode(11), // vertical tab character
            tmpRowDelim = String.fromCharCode(0), // null character

            // actual delimiter characters for CSV format
            colDelim = ',',
            rowDelim = '\n',

            // Grab text from table into CSV formatted string
            csv = $rows.map(function (i, row) {
                var $row = $(row),
                    $cols = $row.find("td[contenteditable='true']");

                return $cols.map(function (j, col) {
                    var $col = $(col),
                        text = $col.text();

                    return text.replace(/"/g, '""'); // escape double quotes

                }).get().join(tmpColDelim);

            }).get().join(tmpRowDelim)
                .split(tmpRowDelim).join(rowDelim)
                .split(tmpColDelim).join(colDelim),

            // Data URI
            csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

        $(this)
            .attr({
            'download': filename,
                'href': csvData,
                'target': '_blank'
        });
    }
	
	function importFromSTP(evt) {
		var files = evt.target.files;
		var file = files[0];
		
		//read the file
		var reader = new FileReader();
		reader.readAsText(file);
		
		reader.onload = function(event) {
			var csv = event.target.result;
			var data = $.csv.toArrays(csv);
			var html = '';
			
			for (var row in data) {
				html += '<tr class="removeRow">\r\n';
				for(var item in data[row]) {
					html += '<td contenteditable="true">' + data[row][item] + '</td>\r\n';
				}
				html += '<td><span class="table-remove glyphicon glyphicon-remove"></span></td><td><span class="table-up glyphicon glyphicon-arrow-up"></span><span class="table-down glyphicon glyphicon-arrow-down"></span></td>\r\n';
				html += '</tr>\r\n';
			}
			
			$('.removeRow').remove();
			$('#table tr:last').before(html);
			
		};
		reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
	}

    // This must be a hyperlink
    $(".export").on('click', function (event) {
		var filename = prompt("Save as...");
		
		var lastFour = filename.substr(filename.length - 4);
		
		if (lastFour.toLowerCase() != ".stp") {
			var filename = filename + ".stp";
		}
		
        // CSV
        exportTableToSTP.apply(this, [$('#table>table'), filename]);
        
        // IF CSV, don't do event.preventDefault() or return false
        // We actually need this to be a typical hyperlink
    });
});

$(function() {
    $( document ).tooltip();
});