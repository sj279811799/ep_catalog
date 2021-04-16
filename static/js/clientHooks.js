'use strict';

/**
 * 判断是几级标题
 * @param nodeName
 */
function getHx(nodeName) {
  switch (nodeName) {
    case 'H1':
      return 1;
    case 'H2':
      return 2;
    case 'H3':
      return 3;
    case 'H4':
      return 4;
    case 'H5':
      return 5;
    case 'H6':
      return 6;
    default:
      return 7;
  }
}

/**
 * 计算左侧margin值（注意：标题号越小，级别越高）
 * @param item
 * @param index
 * @param hList
 * @param marginLeftList
 */
function getIndentationLevel(item, index, hList, marginLeftList) {
  const level = this.getHx(item.nodeName);
  if (level === 1 || index === 0) {
    // 一级标题或第一个标题，不偏移
    return 0;
  } else if (level === this.getHx(hList[index - 1].nodeName)) {
    // 与上一个标题同级，偏移同上
    return marginLeftList[index - 1];
  } else if (level > this.getHx(hList[index - 1].nodeName)) {
    // 低于上一个标题，相对上一个偏移15
    return marginLeftList[index - 1] + 15;
  } else {
    // 高于上一个标题，向前查找
    let destIndex = index - 1;
    while (destIndex > 0 && level < this.getHx(hList[destIndex].nodeName)) {
      destIndex -= 1;
    }
    // 找到高一级标题，偏移+15
    if (level > this.getHx(hList[destIndex].nodeName)) {
      return marginLeftList[destIndex] + 15;
    }
    // 找到同级标题或第一个标题，取相同偏移
    return marginLeftList[destIndex];
  }
}

/**
 * 更新目录
 */
function updateCatalog() {
  // TODO: 查询待优化
  const aceOuterList = document.getElementsByName('ace_outer');
  if (aceOuterList.length === 0) {
    return;
  }
  const aceOuterDoc = aceOuterList[0].contentWindow.document;
  const aceInnerList = aceOuterDoc.getElementsByName('ace_inner');
  const catelogs = aceOuterDoc.getElementById('yqcatelogs');
  if (aceInnerList.length === 0) {
    return;
  }
  const aceInnerDoc = aceInnerList[0].contentWindow.document;
  if (aceInnerDoc && catelogs) {
    // 清空
    catelogs.innerHTML = '';
    const titles = aceInnerDoc.querySelectorAll('h1,h2,h3,h4,h5,h6,h7');
    const catalogsUl = aceOuterDoc.createElement('ul');
    catalogsUl.setAttribute('id','yqcatelogs_ul');
    catalogsUl.setAttribute('class','yq-catelogs-ul');
    titles.forEach((item, index) => {
      const catalogsLi = aceOuterDoc.createElement('li');
      catalogsLi.setAttribute('id',`yqcatelogs_li_${index}`);
      catalogsLi.onclick = () => {
        item.scrollIntoView(true);
      };
      catalogsLi.setAttribute('class',`yq-catelogs-li ${item.nodeName}`);
      catalogsLi.innerText = item.innerText;
      catalogsUl.appendChild(catalogsLi);
    });
    catelogs.appendChild(catalogsUl);
  }
}

/**
 * class发生变化
 * @param name
 * @param context
 * @returns {string[]}
 */
exports.aceAttribsToClasses = (name, context) => {
  console.log('aceAttribsToClasses');
  if (context.key === 'heading') {
    updateCatalog();
  }
};

/**
 * 编辑器初始化
 * @param hook
 * @param context
 */
exports.aceInitialized = (hook, context) => {
  console.log('ep_catalog-aceInitialized');
  const aceOuterList = document.getElementsByName('ace_outer');
  if (aceOuterList.length > 0) {
    const aceOuterDoc = aceOuterList[0].contentWindow.document;
    const outerDocBody = aceOuterDoc.getElementById('outerdocbody');
    const catalogsDiv = aceOuterDoc.createElement('div');
    catalogsDiv.setAttribute('id','yqcatelogs');
    catalogsDiv.setAttribute('class','yq-catelogs');
    outerDocBody.appendChild(catalogsDiv);
  }
  // editorInfo为编辑器对象
  // const editorInfo = context.editorInfo;
};

exports.aceEditorCSS = () => ['/ep_catalog/static/css/catalog.css'];
