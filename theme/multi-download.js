(function($) {
	// Trigger a download of the given URL as an attachment
	function downloadURL(url) {
		// console.log('Download ' + url);
		$('#downloadiframes').append($('<iframe>').attr('src', url));
	}
	// Return the collection of table rows representing files
	function files() {
		return $('#indexlist tr').not('.indexhead');
	}
	// Is the given file row selected for download?
	function isFileSelected(fileRow) {
		var td = fileRow.find('td.indexcolselect');
		var cb = td.find('input.fileselect');
		return cb.prop('checked');
	}
	// Are any files in the given selection state?
	function isAnyFileInState(enabled) {
		var foundOne = false;
		files().each(function(i, elt) {
			if (isFileSelected($(this)) === enabled) {
				foundOne = true;
				return false; // Terminate iteration
			}
		});
		return foundOne;
	}
	// Are any file(s) selected for download?
	function isAnySelected() {
		return isAnyFileInState(true);
	}
	// Are any file(s) not selected for download?
	function isAnyDeselected() {
		return isAnyFileInState(false);
	}
	// Synchronise the UI controls with each other
	function updateUI() {
		// Enable download button only if there are file(s) selected
		$('#downloadSelected').prop('disabled', !isAnySelected());
		// If all files are selected, show deselect all option.
		// If no files are selected, show select all option.
		// If some but not all files are selected, show select all
		// option, but show checkbox in indeterminate state
		var selectAll = $('#selectAll');
		var selectAllLabel = $('#selectAllLabel');
		if (isAnySelected()) {
			// Some or all files selected
			if (isAnyDeselected()) {
				// Some but not all files selected
				selectAll.prop('checked', true)
				.prop('indeterminate', true);
				selectAllLabel.text('Select all');
			} else {
				// All files selected
				selectAll.prop('checked', true)
				.prop('indeterminate', false);
				selectAllLabel.text('Deselect all');
			}
		} else {
			// No files selected
			selectAll.prop('checked', false)
			.prop('indeterminate', false);
			selectAllLabel.text('Select all');
		}
	}
	// Triggers downloads for each selected file
	function downloadSelected() {
		var baseUrl = window.location;
		files().each(function(i, elt) {
			if (isFileSelected($(elt))) {
				var a = $(this).find('td.indexcolname a');
				// TODO: Recurse into directories
				downloadURL(baseUrl + a.attr('href'));
			}
		});
	}
	// Create select all/deselect all checkbox
	function createSelectAll() {
		var cb = $('<input type="checkbox" id="selectAll">');
		var label = $('<label for="selectAll" id="selectAllLabel">')
		.append('Select all');
		var td = $('<th>')
		.addClass('indexcolselect')
		.append(cb)
		.append(label);
		cb.on('change', function() {
			$('input.fileselect').prop(
				'checked',
				$(this).prop('checked')
			);
			updateUI();
		});
		$('#indexlist tr.indexhead').prepend(td);
	}
	// Create checkboxes to select/deselect each individual dirent,
	// skipping 'Parent Directory' entries, so that we do not
	// recurse upwards out of directory trees
	function createFileCheckboxes() {
		files().each(function(i, elt) {
			var cb, label, td, a;
			td = $('<td>').addClass('indexcolselect');
			a = $(this).find('td.indexcolname a');
			if (a.text() !== "Parent Directory") {
				cb = $(
					'<input type="checkbox" id="select' + i + '">'
				).addClass('fileselect');
				label = $('<label for="select' + i + '">')
				.append('Select');
				td.append(cb)
				.append(label);
			}
			$(this).prepend(td);
		});
	}
	// Executed by jQuery after page load
	$(function() {
		createSelectAll()
		createFileCheckboxes();
		// Download selected dirent(s) on button click
		$('#downloadSelected').on('click', downloadSelected);
		// Update UI state when file(s) [de-]selected
		$('input.fileselect').on('change', updateUI);
	});
})(jQuery);
