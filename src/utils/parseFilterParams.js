export function parseFilterParams(query){
    const { type } = query;
    return {
        type,
    }
}