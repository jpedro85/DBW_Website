// checks  if String from conteins uppercase lether
function strContain_UperCase (str) {
    return /\p{Lu}/u.test(str);
}

// checks  if String for conteins uppercase lether
function strContain_LowerCase (str) {
    return /\p{Ll}/u.test(str);
}

// checks  if String for numbers
function strContain_Numbers (str) {
    return str.match(/\d/);
}

// checks  if String for symboles
function strContain_Symbols(str) {
    return /[\p{P}\p{S}]/u.test(str)
}


