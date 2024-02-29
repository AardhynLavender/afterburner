# Afterburner

An interactive mobile software component for theatrical performances

## Configuration and Execution

This project uses `node` with `npm`.

```bash
git clone https://github.com/otago-polytechnic-bit-courses/s2-23-project-AardhynLavender afterburner
cd afterburner
npm i
```

```bash
cp template.env .env
vim .env
```

Follow the Expo [installation instructions](https://docs.expo.dev/get-started/installation/), then use

```bash
npm start
```

The [Expo documentation](https://docs.expo.dev/) covers more ways to run and deploy React Native applications including how to get set up with simulators.

## Environment

As the application uses [public firebase credientials](https://firebase.google.com/support/guides/security-checklist#api-keys-not-secret) for authentication, no environment variables need to be set for the project to run. 

You may wish to change `EXPO_PUBLIC_IS_DEV` to `true` while testing locally, this enables some usefull buttons and shows debug information.

## References

> **Github Copilot**
> 
> Aided while writing the software

> **ChatGPT**
> 
> For bouncing ideas, and issues off. Never writing large amounts of code for me

> **Expo Documentation**
> 
> For all things expo

> **React Native Documentation**
>
> For all things React Native
