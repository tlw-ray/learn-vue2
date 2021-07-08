function toRegexString(array){
    let expression = '';
    array.forEach(word => {
        expression += word + '|'
    });
    expression = expression.substr(0, expression.length - 1);
    return expression;
}

function toCompleteWords(array){
    var completeWords = [];
    array.forEach(word => {
        var completeWord = {
			text: word,
			displayText: word,
			code: word.toLowerCase()
        }
        completeWords.push(completeWord);
    });
    return completeWords;
}