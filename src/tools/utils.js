export function getUrlArg(name) {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

export function changeURLArg(url, arg, arg_val) {
  const pattern = arg + "=([^&]*)";
  const replaceText = arg + "=" + arg_val;
  if (url.match(pattern)) {
    var tmp = "/(" + arg + "=)([^&]*)/gi";
    tmp = url.replace(eval(tmp), replaceText);
    return tmp;
  } else {
    if (url.match("[?]")) {
      return url + "&" + replaceText;
    } else {
      return url + "?" + replaceText;
    }
  }
}
