module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list: function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },
  authorSelect: (authors, author_id) => {
    let tag = '';
    for (let i = 0; i < authors.length; i++)
    { 
      var selected;
      if (author_id == authors[i].id)
      {
        selected = ' selected';
      }
      else{
        selected = '';
      }
      tag += `<option value=${authors[i].id}${selected}>${authors[i].name}</option>`;
    }
    return `<select name="author" >
      ${tag}
    </select>`;
  },
  authorTable: (authors) => {
    var tag = "<table>";
    for (let i = 0; i < authors.length; i++) {
      tag += `<tr>
                    <td>${authors[i].name}</td>
                    <td>${authors[i].profile}</td>
                    <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                    <td>delete</td>
                  </tr>`
    }
    tag += "</table>";
    return (tag + `<style>
      table{
        border-collapse: collapse;
                }
      td{
        border:1px solid black;
                }
    </style>`);
  }
}
