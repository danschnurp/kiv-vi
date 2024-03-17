  var ExcelToJSON = function () {
    this.parseExcel = function (file) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, { type: 'binary' });

        workbook.SheetNames.forEach(function (sheetName) {
          var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          console.log(XL_row_object);
          displayDataInTable(XL_row_object);
        });
      };

      reader.onerror = function (ex) {
        console.log(ex);
      };

      reader.readAsBinaryString(file);
    };
  };

  function handleFileSelect(evt) {
    var files = evt.target.files;
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0]);
  }

  function displayDataInTable(data) {
    var table = document.getElementById("jsonTable");

    // Clear existing table data
    while (table.rows.length > 0) {
      table.deleteRow(0);
    }

    // Add header row
    var header = table.insertRow(0);
    for (var key in data[0]) {
      if (data[0].hasOwnProperty(key)) {
        var th = document.createElement("th");
        th.innerHTML = key;
        header.appendChild(th);
      }
    }

    // Add data rows
    for (var i = 0; i < data.length; i++) {
      var row = table.insertRow(i + 1);
      for (var key in data[i]) {
        if (data[i].hasOwnProperty(key)) {
          var cell = row.insertCell(-1);
          cell.innerHTML = data[i][key];
        }
      }
    }
  }

  document.getElementById('upload').addEventListener('change', handleFileSelect, false);
