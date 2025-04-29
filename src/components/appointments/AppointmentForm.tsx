import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Calendar, Clock, User, Phone, Mail, FileText } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(6, { message: 'Phone number is required' }),
  department: z.string().min(1, { message: 'Please select a department' }),
  date: z.date({ required_error: 'Please select a date' }),
  time: z.string().min(1, { message: 'Please select a time' }),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const departments = [
  { label: 'Cardiology', value: 'cardiology' },
  { label: 'Neurology', value: 'neurology' },
  { label: 'Pediatrics', value: 'pediatrics' },
  { label: 'Orthopedics', value: 'orthopedics' },
  { label: 'Ophthalmology', value: 'ophthalmology' },
  { label: 'General Medicine', value: 'general-medicine' },
];

const workingHoursMap: Record<string, [string, string]> = {
  Monday: ['08:00 AM', '08:00 PM'],
  Tuesday: ['08:00 AM', '08:00 PM'],
  Wednesday: ['08:00 AM', '08:00 PM'],
  Thursday: ['08:00 AM', '08:00 PM'],
  Friday: ['08:00 AM', '08:00 PM'],
  Saturday: ['09:00 AM', '05:00 PM'],
  Sunday: [],
};

const generateTimeSlots = (start: string, end: string): string[] => {
  const slots: string[] = [];
  const toDate = (time: string): Date => new Date(`1970-01-01T${convertTo24Hour(time)}`);

  let current = toDate(start);
  const endTime = toDate(end);

  while (current <= endTime) {
    const formatted = current.toLocaleTimeString([], {
      hour: '2-digit', minute: '2-digit', hour12: true, hourCycle: 'h12',
    });
    slots.push(formatted);
    current = new Date(current.getTime() + 60 * 60 * 1000); // add 1 hour
  }
  return slots;
};

const convertTo24Hour = (timeStr: string): string => {
  const [hour, minute] = timeStr.split(':');
  const [min, modifier] = minute.split(' ');
  let hours = parseInt(hour);
  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${min.padStart(2, '0')}:00`;
};

const AppointmentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      department: '',
      message: '',
      date: undefined,
      time: '',
    },
  });

  useEffect(() => {
    const selectedDate = form.watch('date');
    if (!selectedDate) return;
    const weekday = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    const hours = workingHoursMap[weekday];
    if (!hours || hours.length === 0) {
      setTimeSlots([]);
      form.setValue('time', '');
    } else {
      const [start, end] = hours;
      const slots = generateTimeSlots(start, end);
      setTimeSlots(slots);
    }
  }, [form.watch('date')]);

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    const doctor_id = departments.findIndex((d) => d.value === data.department) + 1 || 1;

    const payload = {
      appointment_date: format(data.date, 'yyyy-MM-dd'),
      appointment_time: convertTo24Hour(data.time),
      fullname: data.fullName,
      email: data.email,
      phone: data.phone,
      message: data.message || '',
      department: data.department,
    };

    try {
      const response = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to book appointment');

      toast.success('Appointment booked successfully!', {
        description: `Scheduled for ${format(data.date, 'PPP')} at ${data.time}`,
      });
      form.reset();
    } catch (err) {
      toast.error('Failed to book appointment', { description: 'Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User size={16} /> Full Name
                </FormLabel>
                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail size={16} /> Email
                </FormLabel>
                <FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Phone size={16} /> Phone
                </FormLabel>
                <FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Department */}
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-2">
                  <Calendar size={16} /> Appointment Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={`w-full pl-3 text-left font-normal ${!field.value && 'text-muted-foreground'}`}>
                        {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => field.onChange(date)}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || date > new Date(new Date().setMonth(new Date().getMonth() + 3))}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time */}
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Clock size={16} /> Appointment Time
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {timeSlots.length > 0 ? timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    )) : <div className="p-2 text-sm text-muted-foreground">please select date first</div>}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Message */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <FileText size={16} /> Message (optional)
              </FormLabel>
              <FormControl><Textarea placeholder="Additional notes..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Book Appointment'}
        </Button>
      </form>
    </Form>
  );
};

export default AppointmentForm;
