import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function AmmunitionList({ user }) {
  const [editAmmoId, setEditAmmoId] = useState(null);
  const [ammunition, setAmmunition] = useState([]);
  const [ammoType, setAmmoType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [maxAmmount, setMaxAmmount] = useState("");
  const [customAmmo, setCustomAmmo] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const popularAmmoOptions = {
    Pistolety: [
      "9mm",
      ".45 ACP",
      ".40 S&W",
      ".380 ACP",
      "10mm Auto",
      ".357 SIG",
    ],
    Karabiny: [
      "5.56 NATO",
      "7.62 NATO",
      ".223 Remington",
      ".308 Winchester",
      "7.62x39mm",
      ".300 AAC Blackout",
    ],
    Strzelby: ["12 Gauge", "20 Gauge", "16 Gauge", ".410 Bore"],
    "Broń wyborowa (snajperska)": [
      ".338 Lapua Magnum",
      ".50 BMG",
      ".300 Winchester Magnum",
      "6.5 Creedmoor",
      ".243 Winchester",
      ".270 Winchester",
    ],
  };

  // Pobierz amunicję z bazy danych
  useEffect(() => {
    fetchAmmunition();
  }, []);

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

  const fetchAmmunition = async () => {
    const { data, error } = await supabase
      .from("ammunition")
      .select("*")
      .eq("user_id", user.id);
    if (error) {
      console.error(error);
    } else {
      setAmmunition(data);
      sessionStorage.setItem("ammoResponse", JSON.stringify(data));
    }
  };

  const addOrEditAmmo = async () => {
    const today = new Date().toISOString().split("T")[0];
    const finalAmmo = customAmmo || ammoType;

    const requestData = {
      ammo_type: finalAmmo,
      quantity,
      max_amount: maxAmmount,
      user_id: user.id,
      updated_at: today,
    };

    if (isEditing) {
      const { error, status } = await supabase
        .from("ammunition")
        .update(requestData)
        .eq("id", editAmmoId);
      if (error || status !== 204) {
        showToast("Failed to update weapon", "error");
        console.error(error);
      } else {
        fetchAmmunition();
        showToast("Ammunition updated successfully", "success");
        document.getElementById("modalAmmo").close();
        resetForm();
      }
    } else {
      const { error, status } = await supabase
        .from("ammunition")
        .insert([requestData]);
      if (error || status !== 201) {
        showToast("Failed to add ammunition", "error");
        console.error(error);
      } else {
        fetchAmmunition();
        showToast("Ammunition added successfully", "success");
        document.getElementById("modalAmmo").close();
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditAmmoId("");
    setAmmoType("");
    setQuantity("");
    setMaxAmmount("");
  };

  const startEditAmmo = (ammo) => {
    setIsEditing(true);
    setEditAmmoId(ammo.id);
    setAmmoType(ammo.ammo_type);
    setQuantity(ammo.quantity);
    setMaxAmmount(ammo.max_amount);
  };

  // Usuń amunicję
  const deleteAmmunition = async (id) => {
    const { data, error } = await supabase
      .from("ammunition")
      .delete()
      .eq("id", id);

    if (error) {
      showToast("Failed to delete ammunition", "success");
    } else {
      setAmmunition(ammunition.filter((ammo) => ammo.id !== id));
      showToast("Ammunition deleted successfully", "success");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Ammunition</h2>

      {/* Formularz dodawania amunicji */}
      <div className="flex gap-4 mb-6">
        <dialog id="modalAmmo" className="modal">
          <div className="modal-box w-96 max-w-full overflow-visible">
            <h2 tabIndex={0} className="text-2xl font-semibold mb-6">
              {isEditing ? "Edit Ammunition" : "Add Ammunition"}
            </h2>
            <div className="flex flex-col flex-wrap gap-4 mb-6">
              <div className="dropdown w-full lg:max-w-xs">
                <label
                  tabIndex={0}
                  className="btn btn-outline btn-error w-full"
                >
                  {ammoType || "Choose Ammo"}
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu flex-nowrap p-2 shadow bg-base-100 rounded-box w-full max-h-96 overflow-y-auto z-10"
                >
                  <li>
                    <input
                      type="text"
                      placeholder="Custom Ammo"
                      className="input input-bordered w-full"
                      value={customAmmo}
                      onChange={(e) => {
                        setCustomAmmo(e.target.value);
                        setAmmoType(e.target.value); // Ustawiamy ammo na customAmmo
                      }}
                    />
                  </li>
                  {Object.entries(popularAmmoOptions).map(
                    ([category, options]) => (
                      <li key={category} className="menu-title">
                        <span>{category}</span>
                        <ul>
                          {options.map((option) => (
                            <li key={option}>
                              <button
                                onClick={() => {
                                  setAmmoType(option); // Ustawiamy ammo na wybraną wartość
                                  setCustomAmmo(""); // Kasujemy customAmmo, bo wybrano jedną z opcji
                                }}
                                className={
                                  ammoType === option ? "text-error" : ""
                                } // Zmieniamy styl dla zaznaczonej opcji
                              >
                                {option}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="flex w-full">
                <div className="card grid h-20 flex-grow place-items-center">
                  <input
                    type="number"
                    placeholder="Quantity"
                    className="input input-bordered w-full lg:max-w-xs"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  />
                </div>
                <div className="divider divider-horizontal"></div>
                <div className="card grid h-20 flex-grow place-items-center">
                  <input
                    type="number"
                    placeholder="Max"
                    className="input input-bordered w-full lg:max-w-xs"
                    value={maxAmmount}
                    onChange={(e) =>
                      setMaxAmmount(parseInt(e.target.value, 10))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  document.getElementById("modalAmmo").close(), resetForm();
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-error"
                onClick={(e) => {
                  e.preventDefault();
                  addOrEditAmmo();
                }}
              >
                {isEditing ? "Save Changes" : "Add Ammunition"}
              </button>
            </div>
          </div>
        </dialog>

        <button
          className="btn btn-error mb-2"
          onClick={() => document.getElementById("modalAmmo").showModal()}
        >
          Add Ammunition
        </button>
      </div>

      {/* Tabela amunicji */}
      <div className="overflow-x-auto">
        <table className="table table-sm w-full table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Stat</th>
              <th className="w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ammunition.map((ammo, index) => (
              <tr key={ammo.id}>
                <th>{index + 1}</th>
                <td>{ammo.ammo_type}</td>
                <td>{ammo.quantity}</td>
                <td>
                  <div
                    className="tooltip w-full min-w-10 max-w-64"
                    data-tip={`${ammo.quantity} / ${ammo.max_amount}`}
                  >
                    <progress
                      className={`progress w-full min-w-14 ${
                        ammo.quantity < ammo.max_amount * 0.3
                          ? "progress-error"
                          : ammo.quantity < ammo.max_amount * 0.5
                          ? "progress-warning"
                          : ""
                      }`}
                      value={ammo.quantity}
                      max={ammo.max_amount}
                    ></progress>
                  </div>
                </td>
                <td className="w-max block">
                  {/* Przycisk do edytowania ilości amunicji */}
                  <button
                    className="btn btn-sm btn-outline mr-2"
                    onClick={() => {
                      startEditAmmo(ammo);
                      document.getElementById("modalAmmo").showModal();
                    }}
                  >
                    ✏
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => deleteAmmunition(ammo.id)}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AmmunitionList;
