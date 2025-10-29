interface HeroSectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick: () => void;
  backgroundImage: string;
}

const AddJobSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  backgroundImage,
}) => {
  return (
    <div className="relative p-4 rounded-xl overflow-hidden md:w-80 h-fit">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${backgroundImage}')`
        }}
      />
      <div className="absolute inset-0 bg-black/50 mix-blend-multiply" />
      <div className="relative z-10 text-white">
        <h1 className="font-bold mb-2">{title}</h1>
        <p className="text-xs mb-4">{subtitle}</p>
        <button
          onClick={onButtonClick}
          className="w-full bg-[#01959F] hover:bg-teal-600 text-white p-3 text-sm rounded-lg font-medium justify-center transition-colors duration-200 flex items-center gap-2"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default AddJobSection;