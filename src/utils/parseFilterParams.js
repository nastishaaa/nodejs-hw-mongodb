export const parseType = (type) => {
    if (typeof type !== 'string') return;
  
    const validTypes = ['work', 'home', 'personal'];
    if (validTypes.includes(type)) return type;
  
    return;
  };
  
export const parseIsFavourite = (isFavourite) => {
    if (typeof isFavourite === 'boolean') return isFavourite;
  
    if (typeof isFavourite === 'string') {
      if (isFavourite.toLowerCase() === 'true') return true;
      if (isFavourite.toLowerCase() === 'false') return false;
    }
  
    return;
  };
  
  export const parseFilterParams = (query) => {
    const { contactType, isFavourite } = query;
  
    const parsedType = parseType(contactType);
    const parsedIsFavourite = parseIsFavourite(isFavourite);
  
    return {
        contactType: parsedType,
        isFavourite: parsedIsFavourite,
    };
  };
  