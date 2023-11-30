//let formData = require('./FormData.json');
//import formData from './FormData.json' assert { type: 'json' };
let formData = [   
  {
      "sort": 1,
      "field": "Name",
      "type": "input"
  },
  {
      "sort": 2,
      "field": "Status",
      "type": "dropdown",
      "options": ["In Progress", "Hold", "Submitted", "Completed"]
  },
  {
      "sort": 3,
      "field": "Urgent",
      "type": "radio",
      "options": ["Yes", "No"]
  }
];

document.getElementById("uploadFile").addEventListener("change", function() {
  var fr = new FileReader();
  fr.onload = function() {
    document.getElementById("fileContents").textContent = this.result;
  }
  fr.addEventListener("load", e => {
    console.log(e.target.result, JSON.parse(fr.result))
  });  
  fr.readAsText(this.files[0]);
});

formData.sort((a,b) => (a.sort > b.sort) ? 1 : ((b.sort > a.sort) ? -1 : 0))
let form = document.createElement("form");
form.setAttribute("method", "post");
form.setAttribute("action" , "submit");
document.getElementsByTagName("body")[0].appendChild(form);

    formData.forEach(function(formItem) {
        const type = formItem.type;
        let label = document.createElement('label');
        switch (type) {
          case 'dropdown':
            let dropdown = document.createElement("select");
            formItem.options.forEach(function(val) {
              let option = document.createElement("option");
              option.innerHTML = val;
              dropdown.appendChild(option);
            })
            label.innerHTML = formItem.field;
            dropdown.appendChild(label); 
            form.appendChild(label);
            form.appendChild(dropdown);
            form.appendChild(document.createElement("br"));           
            break;
          case 'input':
            let input = document.createElement("input");
            input.setAttribute("placeholder", formItem.field);
            label.innerHTML = formItem.field;
            input.appendChild(label);
            form.appendChild(label);
            form.appendChild(input);
            form.appendChild(document.createElement("br"));              
            break;            
          case 'radio':
            label.innerHTML = formItem.field;
            form.appendChild(label);
            form.appendChild(document.createElement("br"));  
            formItem.options.forEach(function(val) {
                let radio = document.createElement("input");
                radio.setAttribute("type", "radio");
                radio.setAttribute("name", formItem.field);
                radio.setAttribute("value", val);
                radio.setAttribute("id", val);
                form.appendChild(radio);
                form.appendChild(document.createElement("br"));  
            })
            break; 
          default:
            console.log(`Sorry, we are out of ${expr}.`);
        }        

    })