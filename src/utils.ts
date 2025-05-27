export function random(len:number) {
    let options="ssdfksldnw4jklfwnraifjx116231f1sd5f1654rw5f";
    let length=options.length;
    let ans="";

    for(let i=0;i<len;i++){
        ans+=options[Math.floor((Math.random()*length))]
    }
    return ans;
}