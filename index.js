class AdBlockCryCry {
  constructor() {
    this.elementIds = [
      "AdHeader",
      "AdContainer",
      "AD_Top",
      "homead",
      "ad-lead",
      "ads",
      "pub_300x250",
      "pub_300x250m",
      "pub_728x90",
      "text-ad",
      "textAd",
      "text_ad",
      "text_ads",
      "text-ads",
      "text-ad-links",
      "adBox",
      "adSlot",
    ];
  }

  init(callback) {
    const dataContainer = document.createElement("div");
    dataContainer.innerHTML = this.generatesHTMLString();
    document.body.append(dataContainer);
    if (document.readyState === "complete") {
      if (callback && typeof callback === "function") {
        callback();
      }
    } else {
      window.addEventListener("load", () => {
        if (callback && typeof callback === "function") {
          callback();
        }
      });
    }
  }

  async detect() {
    const isHTMLBlocked = this.elementIds.some((id) =>
      this.checkVisibilityHidden(id)
    );

    const isResourceBlocked = await this.checkBlockedResource();
    const isRequestBlocked = await this.checkBlockedRequests();

    console.log({
      isHTMLBlocked,
      isResourceBlocked,
      isRequestBlocked,
    });

    return isHTMLBlocked || isResourceBlocked || isRequestBlocked;
  }

  generatesHTMLString() {
    return this.elementIds
      .map(
        (Id) =>
          `<div id="${Id}" style=""><div id="${Id}-child">${Id}</div></div>`
      )
      .join("");
  }

  checkVisibilityHidden(id) {
    const element = document.querySelector(`#${id}`);
    if (!element) return true;

    const style = getComputedStyle(element);

    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      parseFloat(style.opacity) === 0 ||
      style.height === "0px" ||
      style.width === "0px"
    ) {
      console.log("[element] ------", element);
      return true;
    }

    const hasContent = Array.from(element.children).some(
      (child) => child.textContent.trim() !== ""
    );
    return !hasContent;
  }

  checkBlockedResource() {
    return new Promise((resolve) => {
      const fakeAd = document.createElement("img");
      fakeAd.src = `/ads.jpg`;
      fakeAd.onerror = () => resolve(true);
      fakeAd.onload = () => resolve(false);
      document.body.appendChild(fakeAd);
    });
  }

  checkBlockedRequests() {
    return new Promise((resolve) => {
      const randomPath = `/ads.js`;
      fetch(randomPath)
        .then(() => resolve(false))
        .catch(() => resolve(true));
    });
  }
}
export default AdBlockCryCry;
