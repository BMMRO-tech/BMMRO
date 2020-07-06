class Status {
  constructor(status, value) {
    this.status = status;
    this.value = value;
  }

  isSuccessful() {
    return this.status === "SUCCESS";
  }
}

module.exports = Status;
