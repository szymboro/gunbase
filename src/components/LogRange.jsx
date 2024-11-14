import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";

function LogRange({ user }) {
  const [firearms, setFirearms] = useState([]);
  const [ammo, setAmmo] = useState([]);
  const [selectedFirearmId, setSelectedFirearmId] = useState("");
  const [usedAmmo, setUsedAmmo] = useState("");
  const [usedAmmoInStock, setUsedAmmoInStock] = useState(true);

  // Fetch data on component mount

  const showToast = (message, type) => {
    const toastContainer = document.getElementById("toast-container");
    const newToast = document.createElement("div");
    newToast.className = `toast toast-top p-6 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white p-4 rounded shadow-lg`;
    newToast.innerText = message;
    toastContainer.appendChild(newToast);
    setTimeout(() => {
      toastContainer.removeChild(newToast);
    }, 3000);
  };

  const fetchData = async () => {
    const firearmsData = sessionStorage.getItem("firearmsResponse");
    const ammoData = sessionStorage.getItem("ammoResponse");

    if (firearmsData) setFirearms(JSON.parse(firearmsData));
    if (ammoData) setAmmo(JSON.parse(ammoData));
  };

  // Handle dropdown change
  const handleSelectChange = (event) => {
    setSelectedFirearmId(event.target.value);
  };

  // Find the selected firearm based on `selectedFirearmId`
  const selectedFirearm = firearms.find(
    (firearm) => firearm.id === selectedFirearmId
  );

  function ammoType(ammo) {
    return ammo.ammo_type === selectedFirearm.ammo;
  }

  const logRangeShooting = async () => {
    const today = new Date().toISOString().split("T")[0];
    let newMileage = selectedFirearm.mileage + Number(usedAmmo);
    let selectedAmmo = ammo.find(ammoType);
    let ammoUpdated = selectedAmmo.quantity - Number(usedAmmo);

    if (ammoUpdated < 0) ammoUpdated = 0;

    const requestDataFirearms = {
      user_id: user.id,
      mileage: newMileage,
      updated_date: today,
    };

    const requestDataAmmo = {
      ammo_type: selectedFirearm.ammo,
      quantity: ammoUpdated,
      user_id: user.id,
      updated_at: today,
    };

    const { error, status } = await supabase
      .from("weapons")
      .update(requestDataFirearms)
      .eq("id", selectedFirearm.id);
    if (error || status !== 204) {
      showToast("Failed to update weapon", "error");
      console.error(error);
    } else {
      showToast("Weapon updated successfully", "success");
      document.getElementById("modalLog").close();
      //   resetForm();
    }

    if (usedAmmoInStock == true) {
      const { error, status } = await supabase
        .from("ammunition")
        .update(requestDataAmmo)
        .eq("id", selectedAmmo.id);
      if (error || status !== 204) {
        showToast("Failed to update weapon", "error");
        console.error(error);
      } else {
        showToast("Weapon updated successfully", "success");
        document.getElementById("modalAmmo").close();
        // resetForm();
      }
    }
  };

  return (
    <div className="absolute right-0 bottom-0 p-6">
      <dialog id="modalLog" className="modal">
        <div className="modal-box w-80 max-w-full overflow-visible">
          <h2 className="text-2xl font-semibold mb-6">Range log</h2>
          <div className="flex w-full">
            <div className="w-full">
              <select
                className="select select-bordered w-full"
                onChange={handleSelectChange}
                defaultValue=""
              >
                <option value="">Select firearm</option>
                {firearms.map((firearm) => (
                  <option key={firearm.id} value={firearm.id}>
                    {firearm.manufacturer} {firearm.weapon_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Render additional info if a firearm is selected */}
          {selectedFirearm && (
            <div className="w-full">
              <div className="mt-4 border select-bordered p-4 rounded shadow">
                <h3 className="text-lg font-semibold">
                  Selected Firearm Details
                </h3>
                <p>
                  <b>Manufacturer: </b>
                  {selectedFirearm.manufacturer}
                </p>
                <p>
                  <b>Model: </b>
                  {selectedFirearm.weapon_name}
                </p>
                <p>
                  <b>Caliber: </b>
                  {selectedFirearm.ammo}
                </p>
                <p>
                  <b>Mileage: </b>
                  {selectedFirearm.mileage}
                </p>
                {selectedFirearm.serial_number && (
                  <p>
                    <b>Serial No: </b>
                    {selectedFirearm.serial_number}
                  </p>
                )}
                {selectedFirearm.last_shot && (
                  <p>
                    <b>Last Shot: </b>
                    {selectedFirearm.last_shot}
                  </p>
                )}
              </div>
              <div className="mt-4">
                <div className="form-control">
                  <label className="form-control w-full ">
                    <div className="label">
                      <span className="label-text">Ammo used</span>
                    </div>
                    <input
                      type="number"
                      placeholder=""
                      className="input input-bordered w-full "
                      value={usedAmmo}
                      onChange={(e) => {
                        setUsedAmmo(e.target.value);
                      }}
                    />
                  </label>
                  <label className="label cursor-pointer mt-4">
                    <span className="label-text">Used ammo in stock</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      value={usedAmmoInStock}
                      onChange={(e) => {
                        setUsedAmmoInStock(e.target.checked);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={() => {
                document.getElementById("modalLog").close();
                setSelectedFirearmId(null); // Reset selected firearm on close
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-error"
              onClick={(e) => {
                e.preventDefault();
                logRangeShooting();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </dialog>

      <button
        className="btn btn-square"
        onClick={() => {
          document.getElementById("modalLog").showModal(), fetchData();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 rotate-45"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

export default LogRange;
