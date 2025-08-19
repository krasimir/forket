export const FEf_1 = function() {
    "use server";
    console.log("Something else");
};
export const IHaveAName = function IHaveAName() {
    "use server";
    console.log("Server action executed on blur");
};
export const AFf_0 = ()=>{
    "use server";
    console.log("Server action executed");
};
function EmptyNote() {
    return (<>
      <Button foo="bar" onClick={"$FSA_AFf_0"} onBlur={"$FSA_IHaveAName"} andThis={"$FSA_FEf_1"}/>
    </>);
}
