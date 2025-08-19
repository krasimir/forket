function EmptyNote() {
  return (
    <>
      <Button
        foo="bar"
        onClick={() => {
          "use server";
          console.log("Server action executed");
        }}
        onBlur={function IHaveAName() {
          "use server";
          console.log("Server action executed on blur");
        }}
        andThis={function() {
          "use server";
          console.log("Something else");
        }}
      />
    </>
  );
}
