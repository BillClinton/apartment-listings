class FirestoreModel {
  constructor(data) {
    this._id = data.id;
    delete data.id;
    this._fields = data;
  }

  data() {
    return this._fields;
  }

  obj() {
    return { id: this._id, ...this.data() };
  }

  set(item, val) {
    this._fields[item] = val;
  }

  get(item) {
    return this._fields[item];
  }

  static async find() {
    const documents = [];

    return FirestoreModel.db
      .collection(FirestoreModel.collection)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          documents.push({ id: doc.id, ...doc.data() });
        });
        return documents;
      });
  }

  static async findById(id) {
    return FirestoreModel.db
      .collection(FirestoreModel.collection)
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          return { id: id, ...doc.data() };
        } else {
          throw new Error('No such Document');
        }
      });
  }

  async save() {
    const data = this.data();
    const id = this._id;

    const errors = FirestoreModel.schema.validate(data);
    if (errors) {
      return errors;
    }

    if (id) {
      // edit existing
      return FirestoreModel.db
        .collection(FirestoreModel.collection)
        .doc(id)
        .set(data)
        .then(() => {
          return true;
        });
    } else {
      // create new
      return FirestoreModel.db
        .collection(FirestoreModel.collection)
        .add(data)
        .then(function(ref) {
          return { id: ref.id, ...data };
        });
    }
  }

  async remove() {
    const id = this._id;

    return FirestoreModel.db
      .collection(FirestoreModel.collection)
      .doc(id)
      .delete()
      .then(() => {
        return true;
      });
  }
}

module.exports = FirestoreModel;
