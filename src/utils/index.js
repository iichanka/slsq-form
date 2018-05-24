export const clone_ = function(element) {
  let result = (element instanceof Array) ? [] : {};
  for (let key in element) {
    if (element[key])
    {
      if(typeof element[key] == "object")
      {
        if(element[key])
        result[key] = clone_(element[key]);
      } 
      else 
      {
        result[key] = element[key];
      }
    }
  }
  return result;
};


export const clone = (element, references = [], cachedResults = []) => {
  if(element === undefined || element === null)
  {
    return null;
  }

  if (typeof element !== 'object')
  {
    return element;
  }
      
  let index = references.indexOf(element);
  if (index !== -1)
  {
    return cachedResults[index];
  }
      
  let result = (element instanceof Array) ? [] :
      element.constructor ? new element.constructor() : {};

  references.push(element);
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

export const isEqual = (a,b) => {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default {
  isEqual,
  clone,
  clone_
}
