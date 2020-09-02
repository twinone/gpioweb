import React from 'react'

export type ISearchContextData = {
    text: string;
    onSearch: any
};

const SearchContext = React.createContext({
    text: '',
    onSearch: (_: string) => {}
});

export const SearchProvider = SearchContext.Provider;
export const SearchConsumer = SearchContext.Consumer;

export default SearchContext;