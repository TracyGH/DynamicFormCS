function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
//Form file uploaded
document.getElementById("uploadFile").addEventListener("click", function(e) {
  var fileReader = new FileReader();
  fileReader.readAsText(document.getElementById("fileContents").files[0]);
  fileReader.onload = function() {
    document.getElementById("loadForm").hidden = true; //Hide file upload form
    try { //JSON file parse success.
      formData = JSON.parse(fileReader.result);
      formData.sort((a,b) => (a.sort > b.sort) ? 1 : ((b.sort > a.sort) ? -1 : 0))
      //Create form elements
      let form = document.createElement("form");
      form.setAttribute("method", "post");
      form.setAttribute("action" , "submit");
      form.setAttribute("id", "dynamicForm");
      document.getElementsByTagName("body")[0].appendChild(form);
      let formLabel = document.createElement('label', {for: 'dynamicForm'});
      formLabel.innerHTML = "Questionaire";
      form.appendChild(formLabel);
      form.appendChild(document.createElement("br")); 
      //Iterate through form data and create form elements
      formData.forEach(function(formItem) {
          const type = formItem.type;
          let label = document.createElement('label');
          switch (type) {
            case 'dropdown': //Dropdown/select
              let dropdown = document.createElement("select");
              formItem.options.forEach(function(val) {
                let option = document.createElement("option");
                option.innerHTML = val;
                option.setAttribute("className", formItem.field);
                dropdown.appendChild(option);
              })
              label.innerHTML = formItem.field;
              dropdown.appendChild(label); 
              form.appendChild(label);
              form.appendChild(dropdown);
              form.appendChild(document.createElement("br")); 
              form.appendChild(document.createElement("br"));          
              break;
            case 'input': //Text input
              let input = document.createElement("input");
              input.setAttribute("placeholder", formItem.field);
              label.innerHTML = formItem.field;
              input.appendChild(label);
              form.appendChild(label);
              form.appendChild(input);
              form.appendChild(document.createElement("br")); 
              form.appendChild(document.createElement("br"));             
              break;            
            case 'radio': //Radio buttons
              label.innerHTML = formItem.field;
              form.appendChild(label);
              form.appendChild(document.createElement("br"));  
              formItem.options.forEach(function(val) {
                  let radio = document.createElement("input");
                  let radioLabel = document.createElement("label");
                  radioLabel.innerHTML = val;
                  radio.setAttribute("type", "radio");
                  radio.setAttribute("name", formItem.field);
                  radio.setAttribute("value", val);
                  radio.setAttribute("id", val);
                  form.appendChild(radioLabel);
                  form.appendChild(radio);
                  form.appendChild(document.createElement("br")); 
              });
              break; 
            }        
        });
        //Create form Canel, Clear, and Save buttons
        let cancel = document.createElement("button");
        cancel.innerHTML = "Cancel";
        cancel.addEventListener("click", function(e) {
          e.preventDefault();
          removeAllChildNodes(form);
          document.getElementById("loadForm").hidden = false; //Show file upload form
        });
        let clear = document.createElement("button");
        clear.innerHTML = "Clear";
        clear.addEventListener("click", function(e) {
          e.preventDefault();
          form.reset();
        });
        let save = document.createElement("button");
        save.innerHTML = "Save";
        save.addEventListener("click", function(e) { //Save button clicked
          e.preventDefault();
          let data = {}; //Build JSON file output
          form.childNodes.forEach(function(node) {
            if (node.tagName == "INPUT" && node.type == "radio" && node.checked) {
              data[`"${node.name}"`] = node.value;
            }
            if (node.tagName == "INPUT" && node.type == "text") {
              data[`"${node.placeholder}"`] = node.value;
            }
            if (node.tagName == "SELECT") {
              for(var option of node.options) {
                if (option.selected) {
                  data[`"${option.attributes[0].nodeValue}"`] = option.value;
                }
              }            
            }
          });
          const today = new Date();
          data["SubmittedDate"] = today;
          fetch("https://catfact.ninja/facts")
          .then(res => res.json())
          .then(out => {
            data["catFacts"] = out.data.slice(0, 3);
            let blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            let a = document.createElement('a');
            let fileName = "Answer-" + today.getFullYear().toString().slice(-2) + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "-" + getRandomInt(1,1000) + ".json";
            a.download = fileName;
            a.href = window.URL.createObjectURL(blob);
            a.click();            
          })
          .catch(err => { throw err }); //Cat fact API call failed
        });
        form.appendChild(cancel);
        form.appendChild(clear);
        form.appendChild(save);      
    } 
    catch (error) { //JSON file parse failed.
      document.getElementById("loadForm").hidden = false;
      alert("File was not valid JSON. Please try again.");
    }    


  }

  fileReader.error = function(e) { //File read failed.
    console.log("error");
    alert("oops something went wrong, please try again.")
  }
  
});