export function addArrays(arr1: Array<number>, arr2: Array<number>): Array<number>{
    let arr = Array<number>(Math.max(arr1.length, arr2.length));
    for(let i = 0; i< arr.length; i++){
        if(!arr1[i]) {
            arr[i] = arr2[i];
            continue;
        }
        if(!arr2[i]) {
            arr[i] = arr1[i];
            continue;
        }
        arr[i] = arr1[i] + arr2[i];
    }
    return arr;
}