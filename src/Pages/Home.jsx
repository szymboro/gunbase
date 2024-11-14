import AmmunitionList from "../components/AmmunitionList.jsx";
import WeaponList from "../components/WeaponList.jsx";

function Home() {
  return (
    <div className="max-w-7xl">
      <div>
        <WeaponList />
        <AmmunitionList />
      </div>
      <div className="overflow-x-auto"></div>
    </div>
  );
}

export default Home;
