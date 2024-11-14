import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function WeaponList({ user }) {
  const [weapons, setWeapons] = useState([]);
  const [weaponName, setWeaponName] = useState("");
  const [ammo, setAmmo] = useState("");
  const [customAmmo, setCustomAmmo] = useState("");
  const [mileage, setMileage] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [customManufacturer, setCustomManufacturer] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [price, setPrice] = useState("");
  const [datePurchased, setDatePurchased] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editWeaponId, setEditWeaponId] = useState(null);

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

  const manufacturers = [
    "Accuracy International",
    "Armalite",
    "Astra",
    "Beretta",
    "Bersa",
    "Browning",
    "Büchse",
    "Canik",
    "Colt",
    "CZ",
    "Diamondback",
    "DPMS Panther Arms",
    "FNH USA (FN Herstal)",
    "Glock",
    "Heckler & Koch",
    "IWI (Israel Weapon Industries)",
    "Kel-Tec",
    "Kimber",
    "Kahr Arms",
    "Luger",
    "M1 Garand",
    "Mossberg",
    "Remington",
    "Ruger",
    "Sako",
    "Savage Arms",
    "SIG Sauer",
    "Smith & Wesson",
    "Springfield Armory",
    "Steyr Arms",
    "Taurus",
    "Walther",
    "Winchester",
    "Zastava Arms",
  ];

  useEffect(() => {
    fetchWeapons();
  }, []);

  const showToast = (message, type) => {
    const toastContainer = document.getElementById("toast-container");
    const newToast = document.createElement("div");
    newToast.className = `toast toast-top m-6 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white p-4 rounded shadow-lg`;
    newToast.innerText = message;
    toastContainer.appendChild(newToast);
    setTimeout(() => {
      toastContainer.removeChild(newToast);
    }, 3000);
  };

  const fetchWeapons = async () => {
    const { data, error } = await supabase
      .from("weapons")
      .select("*")
      .eq("user_id", user.id);
    if (error) console.error(error);
    else {
      setWeapons(data);
      sessionStorage.setItem("firearmsResponse", JSON.stringify(data));
    }
  };

  const addOrEditWeapon = async () => {
    const today = new Date().toISOString().split("T")[0];
    const finalAmmo = customAmmo || ammo;
    const finalManufacturer = customManufacturer || manufacturer;

    const weaponData = {
      user_id: user.id,
      weapon_name: weaponName,
      ammo: finalAmmo,
      mileage,
      manufacturer: finalManufacturer,
      serial_number: serialNumber,
      price,
      date_purchased: datePurchased,
      date_added: isEditing ? undefined : today,
      updated_date: today,
    };

    if (isEditing) {
      const { error, status } = await supabase
        .from("weapons")
        .update(weaponData)
        .eq("id", editWeaponId);
      if (error || status !== 204) {
        showToast("Failed to update weapon", "error");
        console.error(error);
      } else {
        fetchWeapons();
        showToast("Weapon updated successfully", "success");
        document.getElementById("my_modal_4").close();
        resetForm();
      }
    } else {
      const { error, status } = await supabase
        .from("weapons")
        .insert([weaponData]);
      if (error || status !== 201) {
        showToast("Failed to add weapon", "error");
        console.error(error);
      } else {
        fetchWeapons();
        showToast("Weapon added successfully", "success");
        document.getElementById("my_modal_4").close();
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setWeaponName("");
    setAmmo("");
    setCustomAmmo("");
    setMileage("");
    setManufacturer("");
    setSerialNumber("");
    setPrice("");
    setDatePurchased("");
    setIsEditing(false);
    setEditWeaponId(null);
  };

  const startEditWeapon = (weapon) => {
    setIsEditing(true);
    setEditWeaponId(weapon.id);
    setWeaponName(weapon.weapon_name);
    setAmmo(weapon.ammo);
    setCustomAmmo("");
    setMileage(weapon.mileage);
    setManufacturer(weapon.manufacturer);
    setSerialNumber(weapon.serial_number);
    setPrice(weapon.price);
    setDatePurchased(weapon.date_purchased);
  };

  const deleteWeapon = async (weaponId) => {
    const { error } = await supabase
      .from("weapons")
      .delete()
      .eq("id", weaponId);
    if (error) {
      showToast("Failed to delete weapon", "error");
      console.error(error);
    } else {
      setWeapons((prevWeapons) =>
        prevWeapons.filter((weapon) => weapon.id !== weaponId)
      );
      showToast("Weapon deleted successfully", "success");
    }
  };

  return (
    <div className="p-6 relative">
      <div
        id="toast-container"
        className="fixed top-4 right-4 space-y-2 z-50"
      ></div>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-96 max-w-full">
          <h2 tabIndex={0} className="text-2xl font-semibold mb-6">
            {isEditing ? "Edit Weapon" : "Add new firearm"}
          </h2>
          <div className="flex flex-col flex-wrap gap-4 mb-6">
            {/* Manufacturer Dropdown and Custom Manufacturer Input */}
            <div className="dropdown w-full">
              <label tabIndex={0} className="btn btn-outline btn-error w-full">
                {customManufacturer || manufacturer || "Pick Manufacturer"}
              </label>
              <ul className="dropdown-content menu flex-nowrap p-2 shadow bg-base-100 rounded-box w-full max-h-96 overflow-y-auto z-10">
                <li>
                  <input
                    type="text"
                    placeholder="Custom Manufacturer"
                    className="input input-bordered w-full"
                    value={customManufacturer}
                    onChange={(e) => {
                      setCustomManufacturer(e.target.value);
                      setManufacturer(""); // Clear manufacturer selection when custom is being entered
                    }}
                  />
                </li>
                {manufacturers.map((manufacturerOption) => (
                  <li key={manufacturerOption}>
                    <button
                      type="button"
                      onClick={() => {
                        setManufacturer(manufacturerOption);
                        setCustomManufacturer(""); // Clear custom manufacturer input if predefined is selected
                      }}
                      className={
                        manufacturer === manufacturerOption ? "text-error" : ""
                      }
                    >
                      {manufacturerOption}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weapon Name */}
            <input
              type="text"
              placeholder="Model"
              className="input input-bordered w-full"
              value={weaponName}
              onChange={(e) => setWeaponName(e.target.value)}
              required
            />

            {/* Ammo Dropdown */}
            <div className="dropdown w-full">
              <label tabIndex={0} className="btn btn-outline btn-error w-full">
                {customAmmo || ammo || "Choose Ammo"}
              </label>
              <ul className="dropdown-content menu flex-nowrap p-2 shadow bg-base-100 rounded-box w-full max-h-96 overflow-y-auto z-10">
                <li>
                  <input
                    type="text"
                    placeholder="Custom Ammo"
                    className="input input-bordered w-full"
                    value={customAmmo}
                    onChange={(e) => {
                      setCustomAmmo(e.target.value);
                      setAmmo(""); // Clear selected ammo when custom is being entered
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
                              type="button"
                              onClick={() => {
                                setAmmo(option);
                                setCustomAmmo(""); // Clear custom ammo if predefined is selected
                              }}
                              className={ammo === option ? "text-error" : ""}
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

            {/* Other fields */}
            <input
              type="number"
              placeholder="Mileage"
              className="input input-bordered w-full"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
            <input
              type="text"
              placeholder="Serial no."
              className="input input-bordered w-full"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              className="input input-bordered w-full"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Date purchased</span>
              </div>
              <input
                type="date"
                className="input input-bordered w-full"
                value={datePurchased}
                onChange={(e) => setDatePurchased(e.target.value)}
              />
            </label>
          </div>
          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={() => {
                document.getElementById("my_modal_4").close(), resetForm();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-error"
              onClick={(e) => {
                e.preventDefault();
                addOrEditWeapon();
              }}
            >
              {isEditing ? "Save Changes" : "Add Weapon"}
            </button>
          </div>
        </div>
      </dialog>
      <h2 className="text-2xl font-semibold mb-6">Firearms</h2>
      <button
        className="btn btn-error mb-2"
        onClick={() => document.getElementById("my_modal_4").showModal()}
      >
        Add Weapon
      </button>
      <div className="overflow-x-auto">
        <table className="table table-sm w-full table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Ammo</th>
              <th>Mileage</th>
              <th className="w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {weapons.map((weapon, index) => (
              <tr key={weapon.id}>
                <th>{index + 1}</th>
                <td className="whitespace-nowrap">
                  {weapon.manufacturer + " " + weapon.weapon_name}
                </td>
                <td>{weapon.ammo}</td>
                <td>{weapon.mileage}</td>
                <td className="w-max block">
                  <button
                    className="btn btn-sm btn-outline mr-2"
                    onClick={() => {
                      startEditWeapon(weapon);
                      document.getElementById("my_modal_4").showModal();
                    }}
                  >
                    ✏
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => deleteWeapon(weapon.id)}
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

export default WeaponList;
