  function handleFileSelect(evt) {
    var files = evt.target.files;
    if (files.length === 0) {
      return;
    }

    var reader = new FileReader();

    reader.onload = function (e) {
      var csvData = e.target.result;
      var jsonArray = csvToJSON(csvData);
      displayDataInTable(jsonArray);
    };

    reader.onerror = function (ex) {
      console.log(ex);
    };

    reader.readAsText(files[0]);
  }

  function csvToJSON(csvData) {
    var lines = csvData.split("\n");
    var result = [];
    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    return result;
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
