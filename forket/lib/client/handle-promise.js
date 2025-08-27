function $F_handlePromise(id, status, value, boundaryID) {
  $F_logs("‎𐂐 [server] Promise " + status + " (" + id + ")");
  if (typeof window.$FLP_ === 'undefined') {
    window.$FLP_ = {};
  }
  if (typeof window.$FLP_[id] === 'undefined') {
    window.$FLP_[id] = {
      value,
      status,
      boundaryID
    };
  } else {
    window.$FLP_[id].status = status;
    window.$FLP_[id].value = value;
    window.$FLP_[id].boundaryID = boundaryID;
  }
  if (typeof window.FLP_process === 'function') {
    window.FLP_process(id);
  }
}