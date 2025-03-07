import {observable, action} from "mobx";
import {IS_MOBILE_PREVIEW_MODE} from "../utils/constant";

class View {
  // 现有属性
  @observable isEditAreaOpen = true;

  @observable isPreviewAreaOpen = true;

  @observable isStyleEditorOpen = false;

  @observable isImmersiveEditing = false;

  // 新增移动设备检测
  @observable isMobileDevice = false;

  // 添加移动端编辑/预览状态
  @observable isMobilePreviewMode = false;

  constructor() {
    // 检测是否为移动设备
    this.detectMobileDevice();
    // 监听窗口大小变化
    window.addEventListener("resize", this.detectMobileDevice);
  }

  @action
  detectMobileDevice = () => {
    this.isMobileDevice = window.innerWidth <= 768;
  };

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

  // 添加移动端预览模式切换方法
  @action
  toggleMobilePreviewMode = (value) => {
    this.isMobilePreviewMode = value;
    window.localStorage.setItem(IS_MOBILE_PREVIEW_MODE, JSON.stringify(value));
  };

  @action
  toggleMobilePreviewMode = () => {
    this.isMobilePreviewMode = !this.isMobilePreviewMode;
  };
}

const store = new View();

// 初始化移动端预览模式状态
const storedPreviewMode = window.localStorage.getItem(IS_MOBILE_PREVIEW_MODE);
if (storedPreviewMode !== null) {
  store.isMobilePreviewMode = JSON.parse(storedPreviewMode);
}

export default store;
