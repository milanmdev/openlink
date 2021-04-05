async function create() {
  var link = document.getElementById("link").value;
  var slug = document.getElementById("slug").value;

  if (!link || !slug) {
    document.getElementById('noinfo_message').style.display = "flex";
    document.getElementById('success_message').style.display = "none";
    document.getElementById('slug_exists').style.display = "none";
    return;
  }

  const response = await fetch(`/api/create?link=${link}&slug=${slug}`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  });
  let myJson = await response.json();
  console.log(myJson)
  if (myJson.message == "Slug already exists") {
    document.getElementById('slug_exists').style.display = "flex";
    document.getElementById('noinfo_message').style.display = "none";
    document.getElementById('success_message').style.display = "none";
    return;
  }
  document.getElementById('slug_exists').style.display = "none";
  document.getElementById('noinfo_message').style.display = "none";
  document.getElementById('success_message').style.display = "flex";

}
