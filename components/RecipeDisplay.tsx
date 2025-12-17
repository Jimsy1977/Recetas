import React, { useState } from 'react';
import { RecipeData } from '../types';
import { 
    Clock, Flame, Users, ChefHat, Scale, 
    Printer, Share2, AlertCircle, ShoppingCart, 
    CheckCircle2, Circle, Utensils, Coins
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface RecipeDisplayProps {
  data: RecipeData;
  imageSrc: string;
  onReset: () => void;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ data, imageSrc, onReset }) => {
  const [servings, setServings] = useState(4); // Default base is 4
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'steps' | 'nutrition'>('overview');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  // Calculations for scaling
  const scaleFactor = servings / 4;

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const toggleIngredient = (key: string) => {
    const newSet = new Set(checkedIngredients);
    if (newSet.has(key)) newSet.delete(key);
    else newSet.add(key);
    setCheckedIngredients(newSet);
  };

  const handlePrint = () => {
    window.print();
  };

  const MacroChart = () => {
    const chartData = [
        { name: 'Proteína', value: data.nutrition.protein, color: '#f97316' }, // Orange
        { name: 'Carbos', value: data.nutrition.carbs, color: '#84cc16' },   // Green
        { name: 'Grasa', value: data.nutrition.fat, color: '#fbbf24' },       // Yellow
    ];

    return (
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs mt-2">
                {chartData.map(d => (
                    <div key={d.name} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>
                        <span>{d.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  const DifficultyBadge = () => {
    const colors = {
        'Principiante': 'bg-green-100 text-green-700 border-green-200',
        'Intermedio': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Avanzado': 'bg-red-100 text-red-700 border-red-200'
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[data.difficulty.level] || colors.Principiante}`}>
            {data.difficulty.level} • {data.difficulty.score}/10
        </span>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden animate-fade-in print:shadow-none">
      
      {/* Header Image & Actions */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden group">
        <img src={imageSrc} alt={data.identification.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
            <div className="flex justify-between items-end">
                <div>
                    <h5 className="text-chef-orange font-bold tracking-widest text-xs uppercase mb-2">
                        {data.identification.cuisine} • {data.identification.category}
                    </h5>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2 shadow-sm">
                        {data.identification.name}
                    </h1>
                    <p className="text-white/80 text-sm max-w-xl italic hidden md:block">
                        {data.identification.cultureContext}
                    </p>
                </div>
                <div className="flex gap-2 no-print">
                    <button onClick={handlePrint} className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full transition-all text-white" title="Imprimir PDF">
                        <Printer size={20} />
                    </button>
                    <button onClick={onReset} className="px-4 py-2 bg-chef-orange hover:bg-orange-600 text-white rounded-full font-medium text-sm transition-all shadow-lg">
                        Analizar Otro
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-stone-50 border-b border-stone-200 p-4 flex flex-wrap gap-6 justify-center text-stone-600 text-sm">
        <div className="flex items-center gap-2">
            <Clock size={16} className="text-chef-orange" />
            <span className="font-semibold">{data.timings.totalTime}</span>
        </div>
        <div className="flex items-center gap-2">
            <Users size={16} className="text-chef-orange" />
            <div className="flex items-center gap-1">
                <span className="font-semibold text-stone-800">{servings}</span>
                <span>Porciones</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Flame size={16} className="text-chef-orange" />
            <span className="font-semibold">{data.nutrition.calories} kcal</span>
        </div>
        <div className="flex items-center gap-2">
            <Coins size={16} className="text-chef-green" />
            <span className="font-semibold">{data.cost.perServing} /porc</span>
        </div>
        <DifficultyBadge />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row min-h-[500px]">
        
        {/* Navigation Sidebar (Mobile: Top Bar) */}
        <div className="md:w-64 bg-stone-50 border-r border-stone-200 flex md:flex-col overflow-x-auto no-print">
            {[
                { id: 'overview', icon: ChefHat, label: 'Notas del Chef' },
                { id: 'ingredients', icon: ShoppingCart, label: 'Ingredientes' },
                { id: 'steps', icon: Utensils, label: 'Preparación' },
                { id: 'nutrition', icon: Scale, label: 'Nutrición' },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-3 px-6 py-4 transition-all whitespace-nowrap md:whitespace-normal
                        ${activeTab === tab.id 
                            ? 'bg-white text-chef-orange border-l-4 border-chef-orange shadow-sm md:shadow-none' 
                            : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'
                        }
                    `}
                >
                    <tab.icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                </button>
            ))}
        </div>

        {/* Content Pane */}
        <div className="flex-1 p-6 md:p-8 bg-white print:w-full">
            
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-in">
                    <section>
                        <h3 className="text-xl font-serif font-bold text-stone-800 mb-4 flex items-center gap-2">
                            <ChefHat className="text-chef-orange" size={24}/> 
                            Análisis del Chef
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                                <h4 className="font-bold text-orange-800 mb-2 text-sm uppercase tracking-wider">Inspección Visual</h4>
                                <ul className="space-y-2 text-stone-700 text-sm">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="mt-0.5 text-chef-orange shrink-0"/>
                                        <span><b>Técnica:</b> {data.visualAnalysis.cookingMethod}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="mt-0.5 text-chef-orange shrink-0"/>
                                        <span><b>Presentación:</b> {data.visualAnalysis.presentation}</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-stone-100 p-5 rounded-xl border border-stone-200">
                                <h4 className="font-bold text-stone-700 mb-2 text-sm uppercase tracking-wider">Tips Profesionales</h4>
                                <ul className="space-y-2 text-stone-600 text-sm list-disc pl-4">
                                    {data.chefTips.map((tip, idx) => (
                                        <li key={idx}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                    
                    <section>
                        <h3 className="text-xl font-serif font-bold text-stone-800 mb-4">Variaciones Dietéticas</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {data.variations.vegetarian && (
                                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                                    <span className="text-xs font-bold text-green-700 uppercase bg-green-200 px-2 py-0.5 rounded">Vegetariano</span>
                                    <p className="mt-2 text-xs text-green-800">{data.variations.vegetarian}</p>
                                </div>
                            )}
                            {data.variations.vegan && (
                                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                                    <span className="text-xs font-bold text-green-700 uppercase bg-green-200 px-2 py-0.5 rounded">Vegano</span>
                                    <p className="mt-2 text-xs text-green-800">{data.variations.vegan}</p>
                                </div>
                            )}
                            {data.variations.lowCarb && (
                                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                                    <span className="text-xs font-bold text-blue-700 uppercase bg-blue-200 px-2 py-0.5 rounded">Low Carb</span>
                                    <p className="mt-2 text-xs text-blue-800">{data.variations.lowCarb}</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            )}

            {/* TAB: INGREDIENTS */}
            {activeTab === 'ingredients' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-center bg-stone-50 p-4 rounded-xl gap-4 no-print">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <Users size={20} className="text-chef-orange" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-stone-500 uppercase">Ajustar Porciones</p>
                                <p className="text-lg font-bold text-stone-800">{servings} Comensales</p>
                            </div>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="12" 
                            value={servings} 
                            onChange={(e) => setServings(parseInt(e.target.value))}
                            className="w-full md:w-48 accent-chef-orange h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="grid gap-6">
                        {['Base', 'Salsa', 'Guarnición', 'Acompañamiento'].map((section) => {
                            const sectionIngredients = data.ingredients.filter(i => i.section === section);
                            if (sectionIngredients.length === 0) return null;

                            return (
                                <div key={section} className="bg-white">
                                    <h4 className="text-chef-orange font-bold text-sm uppercase tracking-wider mb-3 pb-1 border-b border-orange-100">
                                        {section}
                                    </h4>
                                    <ul className="space-y-3">
                                        {sectionIngredients.map((ing, idx) => {
                                            const uniqueKey = `${section}-${ing.item}-${idx}`;
                                            const adjustedQty = ing.quantity > 0 ? (ing.quantity * scaleFactor).toFixed(1).replace('.0', '') : '';
                                            const isChecked = checkedIngredients.has(uniqueKey);

                                            return (
                                                <li 
                                                    key={uniqueKey} 
                                                    className={`group flex items-start justify-between p-2 rounded hover:bg-stone-50 transition-colors cursor-pointer ${isChecked ? 'opacity-50' : ''}`}
                                                    onClick={() => toggleIngredient(uniqueKey)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-chef-green border-chef-green' : 'border-stone-300'}`}>
                                                            {isChecked && <CheckCircle2 size={14} className="text-white" />}
                                                        </div>
                                                        <div>
                                                            <span className={`font-medium ${isChecked ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                                                                {adjustedQty} {ing.unit}
                                                            </span>
                                                            <span className={`ml-1 ${isChecked ? 'line-through text-stone-400' : 'text-stone-600'}`}>
                                                                {ing.item}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {ing.substitute && (
                                                        <div className="hidden group-hover:block text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                                            Sust: {ing.substitute}
                                                        </div>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAB: STEPS */}
            {activeTab === 'steps' && (
                <div className="space-y-8 animate-fade-in">
                     <div className="flex gap-4 mb-6 text-sm text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-200">
                        <span>Prep: <b>{data.timings.prepTime}</b></span>
                        <span className="text-stone-300">|</span>
                        <span>Cocción: <b>{data.timings.cookTime}</b></span>
                        <span className="text-stone-300">|</span>
                        <span>Total: <b>{data.timings.totalTime}</b></span>
                    </div>

                    <div className="space-y-6">
                        {data.preparation.map((step, idx) => {
                             const isDone = completedSteps.includes(step.stepNumber);
                             return (
                                <div 
                                    key={idx} 
                                    className={`relative pl-8 pb-8 border-l-2 last:border-0 ${isDone ? 'border-chef-green' : 'border-stone-200'}`}
                                >
                                    <div 
                                        onClick={() => toggleStep(step.stepNumber)}
                                        className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 cursor-pointer transition-colors ${isDone ? 'bg-chef-green border-chef-green' : 'bg-white border-stone-300'}`}
                                    ></div>
                                    
                                    <div className={`transition-opacity ${isDone ? 'opacity-50' : 'opacity-100'}`}>
                                        <h4 className="font-serif font-bold text-lg text-stone-800 mb-2 flex justify-between">
                                            Paso {step.stepNumber}
                                            {step.temperature && (
                                                <span className="text-xs font-sans font-normal bg-red-50 text-red-600 px-2 py-1 rounded-full flex items-center gap-1">
                                                    <Flame size={12}/> {step.temperature}
                                                </span>
                                            )}
                                        </h4>
                                        <p className="text-stone-600 leading-relaxed mb-3">
                                            {step.instruction}
                                        </p>
                                        {step.duration && (
                                            <div className="inline-flex items-center gap-1 text-xs font-semibold text-chef-orange bg-orange-50 px-2 py-1 rounded">
                                                <Clock size={12}/> {step.duration}
                                            </div>
                                        )}
                                    </div>
                                </div>
                             );
                        })}
                    </div>
                </div>
            )}

            {/* TAB: NUTRITION */}
            {activeTab === 'nutrition' && (
                <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-stone-800 mb-4">Desglose de Macros</h3>
                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                            <MacroChart />
                        </div>
                        <div className="mt-6">
                            <h4 className="font-bold text-stone-700 mb-2">Estimación de Costo</h4>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-green-700 uppercase font-bold">Total Receta</p>
                                    <p className="text-lg md:text-xl font-bold text-green-800 whitespace-pre-wrap">{data.cost.totalEstimated}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-green-700 uppercase font-bold">Por Porción</p>
                                    <p className="text-lg font-bold text-green-800">{data.cost.perServing}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-2 border-stone-800 p-4 font-sans max-w-sm mx-auto bg-white">
                        <h2 className="font-black text-3xl border-b-8 border-stone-800 pb-1">Nutrition Facts</h2>
                        <p className="text-sm font-bold border-b border-stone-800 py-1">Cantidad por porción</p>
                        <div className="flex justify-between items-end border-b-4 border-stone-800 py-2">
                            <span className="font-bold text-2xl">Calorías</span>
                            <span className="font-black text-4xl">{data.nutrition.calories}</span>
                        </div>
                        <div className="text-sm">
                            <div className="flex justify-between border-b border-stone-300 py-1">
                                <span className="font-bold">Grasa Total <span className="font-normal">{data.nutrition.fat}g</span></span>
                            </div>
                            <div className="flex justify-between border-b border-stone-300 py-1">
                                <span className="font-bold">Sodio <span className="font-normal">{data.nutrition.sodium}mg</span></span>
                            </div>
                            <div className="flex justify-between border-b border-stone-300 py-1">
                                <span className="font-bold">Carbohidratos Totales <span className="font-normal">{data.nutrition.carbs}g</span></span>
                            </div>
                            <div className="pl-4 border-b border-stone-300 py-1">
                                Fibra Dietética {data.nutrition.fiber}g
                            </div>
                            <div className="pl-4 border-b border-stone-300 py-1">
                                Azúcares {data.nutrition.sugar}g
                            </div>
                            <div className="flex justify-between border-b-8 border-stone-800 py-1">
                                <span className="font-bold">Proteína <span className="font-normal">{data.nutrition.protein}g</span></span>
                            </div>
                        </div>
                        <p className="text-[10px] mt-2 leading-tight text-stone-500">
                            * El % de Valor Diario (VD) indica cuánto contribuye un nutriente en una porción de alimento a una dieta diaria. Se utilizan 2,000 calorías al día para consejos generales de nutrición. Las estimaciones de IA son aproximadas.
                        </p>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default RecipeDisplay;