const DeleteModal = ({ setShowDeleteModal, confirmDelete, name }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-black bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8">
      <h3 className="text-2xl font-bold text-white mb-4">Confirm Deletion</h3>
      <p className="text-white mb-6">Are you sure you want to delete {name}?</p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 rounded bg-black text-white hover:bg-opacity-80"
        >
          Cancel
        </button>
        <button
          onClick={confirmDelete}
          className="px-4 py-2 rounded bg-[#ae7a31] text-white hover:bg-[#8b6328]"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default DeleteModal;
