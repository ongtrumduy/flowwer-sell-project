import { cloneElement, isValidElement, useMemo } from 'react';
import {
  FormProvider,
  UseFormReturn,
  useForm,
  useFormContext,
} from 'react-hook-form';

interface FormWrapperProps {
  children: React.ReactNode;
  methods?: UseFormReturn;
  onSubmit: (e: unknown) => void;
  autoComplete?: boolean;
}

const FormContentChildren = ({ children }: { children: React.ReactNode }) => {
  const { formState } = useFormContext();

  const { errors, isDirty, isValid } = useMemo(() => {
    return formState;
  }, [formState]);

  const cloneChildren =
    children && isValidElement(children)
      ? cloneElement(children, {
          ...children.props,
          formState,
          isDirty,
          isValid,
          errors,
        })
      : children;

  return <>{cloneChildren}</>;
};

export function FormWrapper(props: FormWrapperProps) {
  const { methods, onSubmit, autoComplete, children } = props;
  const formMethod = useForm();
  const newMethods = methods || formMethod;

  return (
    <FormProvider {...newMethods}>
      <form
        onSubmit={newMethods.handleSubmit(onSubmit)}
        autoComplete={autoComplete ? 'on' : 'off'}
      >
        <FormContentChildren {...props}>{children}</FormContentChildren>
      </form>
    </FormProvider>
  );
}
