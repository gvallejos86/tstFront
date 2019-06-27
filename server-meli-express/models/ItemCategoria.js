module.exports = class ItemCategoria {
  constructor(author,data){
    this.item = {};
    this.item['author'] = author;
    this.item['categories'] = data ? data.path_from_root : null;
    this.getItemCategories();
  }

  getItemCategories(){
    return this.item;
  }

}
