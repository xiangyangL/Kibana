import { sortBy } from 'lodash';
import UiNavLink from './ui_nav_link';
import Collection from '../utils/collection';

const inOrderCache = Symbol('inOrder');

export default class UiNavLinkCollection extends Collection {

  constructor(uiExports, parent) {
    super();
    this.uiExports = uiExports;
  }

  new(spec) {
    const link = new UiNavLink(this.uiExports, spec);
    this[inOrderCache] = null;
    //每个link导航加在一起，将'timelion'排除出去
    if (link.id !== 'timelion') {
      this.add(link);
      return link;
    }
  }

  get inOrder() {
    if (!this[inOrderCache]) {
      this[inOrderCache] = sortBy([...this], 'order');
    }

    return this[inOrderCache];
  }

  delete(value) {
    this[inOrderCache] = null;
    return super.delete(value);
  }

};
