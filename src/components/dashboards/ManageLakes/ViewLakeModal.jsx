import { X } from "lucide-react";

const ViewModal = ({ selectedLake, setShowViewModal }) => (
  <div className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
    <div className="bg-white bg-opacity-80 border-[1px] shadow-lg border-[#ae7a31] backdrop-filter backdrop-blur-lg rounded-xl p-4 sm:p-6 md:p-8 w-full md:w-4/5 lg:w-2/3 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-black">
          {selectedLake?.name}
        </h3>
        <button onClick={() => setShowViewModal(false)} className="p-1">
          <X className="text-black w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        <img
          src={selectedLake?.image}
          alt={selectedLake?.name}
          className="rounded-lg w-full h-48 sm:h-56 md:h-64 object-fill"
        />
        <div className="text-black space-y-2 sm:space-y-4">
          <p className="text-sm sm:text-base">
            <span className="font-bold">Location:</span>{" "}
            {selectedLake?.location}
          </p>
          {/* <p className="text-sm sm:text-base">
            <span className="font-bold">Price:</span> £{selectedLake?.pricing}
            /day
          </p> */}
          <p className="text-sm sm:text-base">
            <span className="font-bold">Description:</span>{" "}
            {selectedLake?.description}
          </p>
          <p className="text-sm sm:text-base">
            <span className="font-bold">Fish Types:</span>{" "}
            {selectedLake?.fishTypes.join(", ")}
          </p>
          {/* <p className="text-sm sm:text-base">
            <span className="font-bold">Facilities:</span>{" "}
            {selectedLake?.facilities.join(", ")}
          </p> */}
          <p className="text-sm sm:text-base">
            <span className="font-bold">Current Stock:</span>{" "}
            {selectedLake?.currentStock}
          </p>
          <p className="text-sm sm:text-base">
            <span className="font-bold">Max Weight:</span>{" "}
            {selectedLake?.maxWeight} (lbs)
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default ViewModal;
