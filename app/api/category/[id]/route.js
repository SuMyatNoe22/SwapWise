import Category from "@/models/Category";

export async function GET(request, { params }) {
    const id = params.id;
    const category = await Category.findById(id)
    return Response.json(category);
}

export async function DELETE(request, { params }) {
    const id = params.id;
    const category = await Category.findByIdAndDelete(id)
    return Response.json(category);
}
export async function PUT(request, { params }) {
    console.log("PUT Request received with params:", params);
    const body = await request.json();
    const { id } = params; 
    console.log("Updating category with ID:", id);
    const updatedCategory = await Category.findByIdAndUpdate(id, body, { new: true });
  
    if (!updatedCategory) {
      return Response.json({ message: "Category not found" }, { status: 404 });
    }
  
    return Response.json(updatedCategory);
  }
  