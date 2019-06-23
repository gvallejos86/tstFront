module.exports = class Item {
  constructor(author,data){
    this.item = {};
    this.item['author'] = author;
    this.item['item'] = this.getItem(data);
    this.getItemFormat();
  }


  getItem(arrItem){
    let resultItem = {};
    let price = {};
    resultItem['id'] = arrItem.item.id;
    resultItem['title'] = arrItem.item.title;
    price['currency'] = arrItem.item.currency_id;
    price['amount'] = arrItem.item.price.toString().indexOf('.') > -1 ? parseInt(arrItem.item.price.toString().split('.')[0]) : arrItem.item.price;
    price['decimals'] = arrItem.item.price.toString().indexOf('.') > -1 ? parseInt(arrItem.item.price.toString().split('.')[1]) : 0;
    resultItem['price'] = price;
    resultItem['picture'] = arrItem.item.pictures[0].url;
    resultItem['condition'] = arrItem.item.condition;
    resultItem['free_shipping'] = arrItem.item.shipping.free_shipping;
    resultItem['sold_quantity'] = arrItem.item.sold_quantity;
    resultItem['description'] = arrItem.description.plain_text;
    return resultItem;
  }

  getItemFormat(){
    return this.item;
  }

}
