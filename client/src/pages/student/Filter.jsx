import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import React, { useState } from 'react'

const categories = [
    { id: "Web Development", label: "Web Development" },
    { id: "Mobile Development", label: "Mobile Development" },
    { id: "Game Development", label: "Game Development" },
    { id: "Programming Languages", label: "Programming Languages" },
    { id: "Database & Design and Development", label: "Database & Design and Development" },
    { id: "Software Testing", label: "Software Testing" },
    { id: "Network & Security", label: "Network & Security" },
    { id: "AI & ML", label: "AI & ML" },
    { id: "Cloud Computing", label: "Cloud Computing" },
    { id: "DevOps & CI/CD", label: "DevOps & CI/CD" },
    { id: "Data Science", label: "Data Science" },
    { id: "Blockchain", label: "Blockchain" },
    { id: "Others", label: "Others" }
]

const Filter = ({ handleFilterChange }) => {
    const [SelectedCategories, setSelectedCategories] = useState([]);
    const [sortByPrice, setSortByPrice] = useState("");

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prevCategories) => {
            const newCategories = prevCategories.includes(categoryId)
                ? prevCategories.filter((id) => id !== categoryId)
                : [...prevCategories, categoryId];

                handleFilterChange(newCategories, sortByPrice);
                return newCategories;
        });
    };

    const selectByPriceHandler = (selectedValue) =>{
        setSortByPrice(selectedValue);
        handleFilterChange(SelectedCategories, selectedValue)
    }

    return (
        <div className='w-full md:w-[20%] '>
            <div className='flex items-center justify-between'>
                <h1 className='font-semibold text-lg md:text-xl'>
                    Filter Options
                </h1>
                <Select onValueChange={selectByPriceHandler}>
                    <SelectTrigger>
                        <SelectValue placeholder="sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Sort By Price</SelectLabel>
                            <SelectItem value="low">Low to high</SelectItem>
                            <SelectItem value="high">high to Low</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Separator className="my-4" />
            <div>
                <h1 className='font-semibold mb-2 text-lg'>Category</h1>
                {
                    categories.map((category) => (
                        <div className='flex items-center space-x-2 my-2'>
                            <Checkbox 
                                id={category.id} 
                                oncheckedChange={() => handleCategoryChange(category.id)} />
                            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {category.label}
                            </Label>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Filter
