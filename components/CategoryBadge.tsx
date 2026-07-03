import { transactionCategoryStyles } from "@/constants"

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const style = (transactionCategoryStyles as any)[category] || transactionCategoryStyles.default

  return (
    <div className={`category-badge ${style.borderColor} ${style.chipBackgroundColor}`}>
      <div className={`size-2 rounded-full ${style.backgroundColor}`} />
      <p className={`text-[12px] font-medium ${style.textColor}`}>{category}</p>
    </div>
  )
}

export default CategoryBadge
