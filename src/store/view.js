import {observable, action} from "mobx";

class View {
  // 现有属性
  @observable isEditAreaOpen = true;
  @observable isPreviewAreaOpen = true;
  @observable isStyleEditorOpen = false;
  @observable isImmersiveEditing = false;
  
  // 新增移动设备检测
  @observable isMobileDevice = false;
  
  constructor() {
    // 检测是否为移动设备
    this.detectMobileDevice();
    // 监听窗口大小变化
    window.addEventListener('resize', this.detectMobileDevice);
  }
  
  @action
  detectMobileDevice = () => {
    this.isMobileDevice = window.innerWidth <= 768;
  }
  
  // 现有方法
  @action
  setEditAreaOpen = (isEditAreaOpen) => {
    this.isEditAreaOpen = isEditAreaOpen;
  };
  
  @action
  setPreviewAreaOpen = (isPreviewAreaOpen) => {
    this.isPreviewAreaOpen = isPreviewAreaOpen;
  };
  
  @action
  setStyleEditorOpen = (isStyleEditorOpen) => {
    this.isStyleEditorOpen = isStyleEditorOpen;
  };
  
  @action
  setImmersiveEditing = (isImmersiveEditing) => {
    this.isImmersiveEditing = isImmersiveEditing;
  };
}

const store = new View();
export default store;
