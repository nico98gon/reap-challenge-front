"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { SquarePlus, ThumbsUpIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

const facilitySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Facility name is required"),
})

const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "The organization name is required")
    .max(23, "The organization name cannot exceed 23 characters"),
  facilities: z.array(facilitySchema).min(1, "At least one facility is required"),
  pcc_org_id: z.string().min(1, "The pcc_org_id is required"),
  pcc_org_uuid: z.string().min(1, "The pcc_org_uuid is required"),
})

interface CreateOrganizationDialogProps {
  onOrganizationCreated: () => void
}

export function CreateOrganizationDialog({ onOrganizationCreated }: CreateOrganizationDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof createOrganizationSchema>>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      facilities: [{ id: 1, name: "" }],
      pcc_org_id: "",
      pcc_org_uuid: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "facilities",
  })

  const onSubmit = async (data: z.infer<typeof createOrganizationSchema>) => {
    setIsLoading(true)
    setServerError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/organizations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create organization.")
      }

      form.reset()
      setIsOpen(false)
      onOrganizationCreated()
      toast.success("Organization created", {
        description: `The organization ${data.name} has been created successfully`,
        icon: <ThumbsUpIcon className="text-green-500" size={20} />
      })
    } catch (error) {
      console.error("Error creating organization:", error)
      setServerError("Failed to create organization. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create Organization</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>Enter the details for the new organization.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pcc_org_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PCC Org ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter PCC Org ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pcc_org_uuid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PCC Org UUID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter PCC Org UUID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Facilities</FormLabel>
              {fields.map((facility, index) => (
                <div key={facility.id} className="flex items-center space-x-4">
                  <FormField
                    control={form.control}
                    name={`facilities.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Facility Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => append({ id: fields.length + 1, name: "" })}
                className="mt-2"
              >
                <SquarePlus size={16} />
                Add Facility
              </Button>
            </div>

            {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}