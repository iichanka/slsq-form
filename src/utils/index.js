/* export const clone = function(element) {
  let result = (element instanceof Array) ? [] : {};
  for (let key in element) {
    if (element[key])
    {
      if(typeof element[key] == "object")
      {
        if(element[key])
        result[key] = clone(element[key]);
      } 
      else 
      {
        result[key] = element[key];
      }
    }
  }
  return result;
}; */


export const clone = (element, references = [], cachedResults = []) => {
  if (typeof element !== 'object')
  {
    return element;
  }
      
  let index = references.indexOf(element);
  if (index !== -1)
  {
    return cachedResults[index];
  }
      
  references.push(element);

  let result = Array.isArray(element) ? [] :
      element.constructor ? new element.constructor() : {};

  cachedResults.push(result);

  for (var key in element)
  {
    if (element.hasOwnProperty(key))
    {
      result[key] = clone(element[key], references, cachedResults);
    }
  }
          
  return result;
}
