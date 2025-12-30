export const getUser = async () => {
    const response = await fetch("http://localhost:8000/api/v1/users",{
    method: "GET",});
return await response.json();
}
{/*write a function to fetch any thing in the frontend here and then call the function in the respective file */}