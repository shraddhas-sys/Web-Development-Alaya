const MealPlanner = () => {
  // States
  const [masterMeals, setMasterMeals] = useState([]);
  const [myPlan, setMyPlan] = useState({ morning: "", afternoon: "", evening: "" });

  // Fetch meals
  useEffect(() => {
    api.get('/user/available-meals').then(res => setMasterMeals(res.data.meals));
  }, []);

  // Helper
  const renderDropdown = (slot) => (
    <select 
      className="p-3 rounded-xl border border-stone-200 w-full mb-4"
      onChange={(e) => setMyPlan({...myPlan, [slot.toLowerCase()]: e.target.value})}
    >
      <option value="">Select {slot} Meal</option>
      {masterMeals
        .filter(m => m.timeSlot === slot)
        .map(meal => <option key={meal.id} value={meal.id}>{meal.name} ({meal.kcal} kcal)</option>)
      }
    </select>
  );

  return (
    <div className="p-8 bg-[#F9F6F2] rounded-3xl shadow-sm">
      <h2 className="font-serif text-2xl mb-6">Plan Your Sacred Meals</h2>
      
      <label className="text-sm text-stone-500 uppercase">Morning</label>
      {renderDropdown("Morning")}

      <label className="text-sm text-stone-500 uppercase">Afternoon</label>
      {renderDropdown("Afternoon")}

      <label className="text-sm text-stone-500 uppercase">Evening</label>
      {renderDropdown("Evening")}

      <button className="bg-[#C67347] text-white px-8 py-3 rounded-full mt-4 w-full">
        Save Today's Menu
      </button>
    </div>
  );
};