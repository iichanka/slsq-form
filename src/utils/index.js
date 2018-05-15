
export const clone = function(element) {
  let result = (element instanceof Array) ? [] : {};
  for (let key in element) {
    if (element[key] && typeof element[key] == "object") {
      result[key] = clone(element[key]);
    } 
    else 
    {
      result[key] = element[key];
    }
  }
  return result;
};