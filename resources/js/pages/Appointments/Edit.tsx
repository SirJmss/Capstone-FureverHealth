import { useState } from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { route } from "ziggy-js";
import PetForm from "@/components/PetForm";
import InputError from "@/components/input-error";
import { type BreadcrumbItem } from "@/types";

interface AppointmentProps {
  pets: { id: number; name: string; user_id: number }[];
  services: { id: number; name: string; price: number }[];
  users?: { id: number; first_name: string; last_name: string }[];
  is_admin: boolean;
  appointment: {
    id: number;
    user_id: number;
    pet_id: number;
    service_id: number;
    appointment_date: string;
    status: string;
    notes: string;
    staff_remarks?: string;
    payment_status: string;
  };
}

interface PageProps {
  auth: {
    user: {
      id: number;
      name: string;
      first_name: string;
      last_name: string;
    };
  };
  [key: string]: any;
}

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: "Appointments", href: "/appointments" },
  { title: "Edit Appointment", href: "" },
];

export default function EditAppointment({
  pets,
  services,
  users,
  is_admin,
  appointment,
}: AppointmentProps) {
  const [showPetModal, setShowPetModal] = useState(false);
  const { auth } = usePage<PageProps>().props;

  // Show only user's pets
  const userPets = pets.filter((pet) => pet.user_id === auth.user.id);
  const [petList, setPetList] = useState(userPets);

  const { data, setData, put, processing, errors } = useForm({
    user_id: appointment.user_id.toString(),
    pet_id: appointment.pet_id?.toString() || "",
    service_id: appointment.service_id?.toString() || "",
    appointment_date: appointment.appointment_date || "",
    status: appointment.status || "pending",
    notes: appointment.notes || "",
    staff_remarks: appointment.staff_remarks || "",
    payment_status: appointment.payment_status || "unpaid",
  });

  const submitAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("appointments.update", appointment.id));
  };

  const handlePetAdded = (newPet: any) => {
    if (newPet.user_id === auth.user.id) {
      setPetList((prev) => [...prev, newPet]);
    }
    setShowPetModal(false);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Appointment" />

      <motion.div
        className="p-4 md:p-6 flex items-center justify-center min-h-[80vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-full max-w-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.h1
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Edit Appointment
            </motion.h1>

            <Link href={route("appointments.index")}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </motion.div>
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={submitAppointment} className="space-y-6">

            {/* Pet Selection */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <Label htmlFor="pet_id" className="text-gray-700 dark:text-gray-300 font-medium">
                Select Pet
              </Label>
              <div className="flex gap-3 mt-2">
                <select
                  id="pet_id"
                  value={data.pet_id}
                  onChange={(e) => setData("pet_id", e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3"
                >
                  <option value="">Select Pet</option>
                  {petList.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name}
                    </option>
                  ))}
                </select>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    onClick={() => setShowPetModal(true)}
                    className="h-12 px-6 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-medium"
                  >
                    + Add Pet
                  </Button>
                </motion.div>
              </div>
              <InputError message={errors.pet_id} className="mt-1" />
            </motion.div>

            {/* Service Selection */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="service_id" className="text-gray-700 dark:text-gray-300 font-medium">
                Select Service
              </Label>
              <select
                id="service_id"
                value={data.service_id}
                onChange={(e) => setData("service_id", e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 mt-2"
              >
                <option value="">Select Service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price}
                  </option>
                ))}
              </select>
              <InputError message={errors.service_id} className="mt-1" />
            </motion.div>

            {/* Appointment Date */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <Label htmlFor="appointment_date" className="text-gray-700 dark:text-gray-300 font-medium">
                Appointment Date & Time
              </Label>
              <Input
                type="datetime-local"
                id="appointment_date"
                value={data.appointment_date}
                onChange={(e) => setData("appointment_date", e.target.value)}
                className="mt-2 h-12 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <InputError message={errors.appointment_date} className="mt-1" />
            </motion.div>

            {/* Admin Fields */}
            {is_admin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="status" className="text-gray-700 dark:text-gray-300 font-medium">
                    Status
                  </Label>
                  <select
                    id="status"
                    value={data.status}
                    onChange={(e) => setData("status", e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 mt-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <InputError message={errors.status} className="mt-1" />
                </motion.div>

                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="payment_status" className="text-gray-700 dark:text-gray-300 font-medium">
                    Payment Status
                  </Label>
                  <select
                    id="payment_status"
                    value={data.payment_status}
                    onChange={(e) => setData("payment_status", e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 mt-2"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  <InputError message={errors.payment_status} className="mt-1" />
                </motion.div>
              </div>
            )}

            {/* Notes */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300 font-medium">
                Customer Notes
              </Label>
              <textarea
                id="notes"
                value={data.notes}
                onChange={(e) => setData("notes", e.target.value)}
                className="w-full h-24 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 mt-2 resize-none"
                placeholder="Any special requests or notes..."
                rows={3}
              />
              <InputError message={errors.notes} className="mt-1" />
            </motion.div>

            {/* Staff Remarks */}
            {is_admin && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <Label htmlFor="staff_remarks" className="text-gray-700 dark:text-gray-300 font-medium">
                  Staff Remarks
                </Label>
                <textarea
                  id="staff_remarks"
                  value={data.staff_remarks}
                  onChange={(e) => setData("staff_remarks", e.target.value)}
                  className="w-full h-24 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 mt-2 resize-none"
                  placeholder="Internal notes..."
                  rows={3}
                />
                <InputError message={errors.staff_remarks} className="mt-1" />
              </motion.div>
            )}

            {/* Submit */}
            <motion.div
              className="pt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                type="submit"
                disabled={processing}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Appointment"
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>

      {/* Pet Modal */}
      <Dialog open={showPetModal} onOpenChange={setShowPetModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add New Pet</DialogTitle>
          </DialogHeader>
          <PetForm onSuccess={handlePetAdded} onClose={() => setShowPetModal(false)} />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}