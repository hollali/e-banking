import Image from 'next/image';
import { topCategoryStyles } from '@/constants';

const Category = ({ category }: CategoryProps) => {
  const style = (topCategoryStyles as any)[category.name] || topCategoryStyles.default;

  return (
    <div className={`flex items-center gap-2 rounded-md p-3 ${style.bg}`}>
      <div className={`rounded-full p-2 ${style.circleBg}`}>
        <Image src={style.icon} width={20} height={20} alt={category.name} />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className={`text-14 font-medium ${style.text.main}`}>{category.name}</p>
        <p className={`text-12 font-normal ${style.text.count}`}>
          {category.count} {category.count === 1 ? 'transaction' : 'transactions'}
        </p>
      </div>
    </div>
  );
};

export default Category;
