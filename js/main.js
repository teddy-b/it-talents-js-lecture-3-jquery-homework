(function($){
	var count = 2,
		cars = [{
			id: 1,
			brand: 'Lykan',
			model: 'HyperSport',
			year: '2013',
			km: '10000'
		}];

	function validateLength(val) {
		var msg = '';
		
		if (!val.length) {
			msg = 'This field is required!';
		}

		return msg;
	}

	function validateNumber(val) {
		var msg = '';
		
		if (!val.match(/[0-9]/g)) {
			msg = 'This field must contain only numbers!';
		}

		return msg;
	}

	$(function() {
		function validateField(selector) {
			$(selector).each(function(i, item){
				var msg,
					$this = $(this);

				msg = validateLength(item.value);

				if ($this.attr("id") == 'year' || $this.attr("id") == 'km'
						|| $this.attr("id") == 'yearToEdit' || $this.attr("id") == 'kmToEdit') {
					msg = msg || validateNumber(item.value);
				}

				if (msg && $this.next('.err').length) {
					$this.next('.err')
						.html(msg);
				} else if (msg) {
					$('<p />').addClass('err')
						.html(msg)
						.css('color', 'red')
						.appendTo($this.parent());
				} else {
					$this.next('.err')
						.remove();
				}
			});
		}

		function addToTable(car) {
			$('<tr />').html(
				'<td class="id">' + car.id + '</td>'
				+ '<td class="brand">' + car.brand + '</td>'
				+ '<td class="model">' + car.model + '</td>'
				+ '<td class="year">' + car.year + '</td>'
				+ '<td class="km">' + car.km + '</td>'
				+ '<td class="action">'
					+ '<button type="button" class="delete">Delete</button>'
					+ '<button type="button" class="edit">Edit</button>'
				+ '</td>'
			).appendTo('tbody');
		}

		function save($this) {
			var $item;

			saveField('brand', $this);
			saveField('model', $this);
			saveField('year', $this);
			saveField('km', $this);

			$item = $this.parents('tr').find('.action');
			$item.html('<button type="button" class="delete">Delete</button>'
				+ '<button type="button" class="edit">Edit</button>');
		}

		function saveField(item, $this) {
			var $item,
				val;
				
			$item = $this.parents('tr').find('#' + item + 'ToEdit');
			val = $item.val();
			$item.parent().html(val);
		}

		$('#addrecord').on('click', function() {
			validateField('tfoot input');

			if (!($('.err').length)) {
				var $this = $(this),
					car = {};

				car.id = count++;
				car.brand = $('#brand').val();
				car.model = $('#model').val();
				car.year = $('#year').val();
				car.km = $('#km').val();

				cars.push(car);
				addToTable(car);

				$('form').get(0).reset();
			}
		}).on('submit', function() {
			return false;
		});

		$('tbody').on('click', '.delete', function() {
			var id,
				$this = $(this);

			if (confirm('Are you sure you want to delete this record?')) {
				id = $this.parents('tr').children().first().text();

				cars = cars.filter(function(el, i) {
					return el.id != id;
				});

				$this.parents('tr').remove();
			}
		});

		$('tbody').on('click', '.edit', function() {
			var $action,
				$this = $(this);

			function makeEditable(item) {
				var $item,
					val;
			
				$item = $this.parents('tr').find('.' + item);
				val = $item.text();
				$item.html('<input type="text" id="' + item + 'ToEdit'
					+ '" name="' + item
					+ '" value = "' + val 
					+ '" />');
			}

			makeEditable('brand');
			makeEditable('model');
			makeEditable('year');
			makeEditable('km');

			$action = $this.parents('tr').find('.action')
				.html('<button type="button" class="save">Save</button>'
					+ '<button type="button" class="cancel">Cancel</button>');
		}).on('click', '.save', function() {
			var id,
				$item,
				$this = $(this);

			validateField('tbody input');

			if (!($('.err').length)) {
				id = $this.parents('tr').children().first().text() - 1;

				cars[id].brand = $('#brandToEdit').val();
				cars[id].model = $('#modelToEdit').val();
				cars[id].year = $('#yearToEdit').val();
				cars[id].km = $('#kmToEdit').val();

				save($this);
			}
		}).on('click', '.cancel', function() {
			var id,
			$this = $(this);

			id = $this.parents('tr').children().first().text() - 1;

			$('#brandToEdit').get(0).value = cars[id].brand;
			$('#modelToEdit').get(0).value = cars[id].model;
			$('#yearToEdit').get(0).value = cars[id].year;
			$('#kmToEdit').get(0).value = cars[id].km;

			save($this);
		});

		addToTable(cars[0]);
	});
}(jQuery));
